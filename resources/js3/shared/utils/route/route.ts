import routeGroups from "@/shared/utils/route/groups";

// --- Utility Functions ---

/**
 * Joins URL path segments correctly, handling slashes.
 * @param {string} base - The base path.
 * @param {...string} parts - Path segments to join.
 * @returns {string} The combined path.
 */
function joinPaths(base = '', ...parts) {
    let combined = base;
    for (const part of parts) {
        if (!part) continue;
        if (combined.endsWith('/') && part.startsWith('/')) {
            combined += part.substring(1);
        } else if (!combined.endsWith('/') && !part.startsWith('/')) {
            combined += '/' + part;
        } else {
            combined += part;
        }
    }
    // Ensure path starts with '/' unless it's empty
    if (combined.length > 0 && !combined.startsWith('/')) {
        combined = '/' + combined;
    }
    // Remove trailing '/' unless the path is just '/'
    if (combined.length > 1 && combined.endsWith('/')) {
        combined = combined.slice(0, -1);
    }
    return combined;
}

// --- Route Map Generation ---

let _routeMap = null;
let _isInitialized = false;

/**
 * Stores route information including the raw path template and identified path parameters.
 * Format: { routeName: { template: "path/template/:param", params: ["param"] } }
 */
let _routeInfo = {};

/**
 * Initializes the route map and route information.
 * @returns {Promise<object>} The generated route map.
 */
async function _initializeRouteMap() {
    if (_isInitialized) return _routeMap;

    const routeMap = {};
    _routeInfo = {}; // Reset route info

    /**
     * Recursively processes route items (routes or groups).
     * @param {Array|object} items - Route definitions.
     * @param {string} currentPathPrefix - Accumulated path prefix.
     * @param {string} currentNamePrefix - Accumulated name prefix.
     */
    async function processRouteItems(items, currentPathPrefix = '', currentNamePrefix = '') {
        const routesArray = Array.isArray(items) ? items : Object.values(items);

        for (const item of routesArray) {
            const itemPath = item.path || '';
            // Ensure name is always a string, handle cases where it might be undefined or null
            const itemNameSegment = item.name ? String(item.name) : '';
            const finalNamePrefix = currentNamePrefix + itemNameSegment;

            const potentialPathParams = [];
            const pathSegments = (itemPath || '').split('/').filter(segment => segment.startsWith(':'));
            potentialPathParams.push(...pathSegments.map(segment => segment.substring(1))); // Remove ':'

            const resolvedPath = joinPaths(currentPathPrefix, itemPath === '/' ? '' : itemPath);

            if (item.children) {
                const childPathPrefix = resolvedPath;
                // If the item itself has a name and path, it represents a group/namespace
                // We need to pass the childPathPrefix and finalNamePrefix correctly
                await processRouteItems(item.children, childPathPrefix, finalNamePrefix);
            } else {
                // This is a leaf route
                const finalName = finalNamePrefix;
                let cleanedPath = resolvedPath;
                if (cleanedPath.length > 1 && cleanedPath.endsWith('/')) {
                    cleanedPath = cleanedPath.slice(0, -1);
                }

                routeMap[finalName] = cleanedPath;
                _routeInfo[finalName] = {
                    template: cleanedPath, // Store the raw template
                    params: potentialPathParams.concat(item.params || []) // Combine found params with any explicitly defined ones
                };
            }
        }
    }

    // Process routes defined in routeGroups
    for (const group of routeGroups) {
        try {
            const importedModule = await group.routes();
            const importedRoutes = importedModule.default || importedModule;

            if (Array.isArray(importedRoutes)) {
                await processRouteItems(importedRoutes, `/${group.prefix}`, group.name);
            } else if (typeof importedRoutes === 'object' && importedRoutes !== null) {
                // Process top-level routes within the group
                for (const key in importedRoutes) {
                    const routeItem = importedRoutes[key];
                    const basePath = routeItem.path || '';
                    const groupPath = joinPaths(`/${group.prefix}`, basePath === '/' ? '' : basePath);
                    const groupName = group.name + (routeItem.name || '');

                    if (routeItem.children) {
                        await processRouteItems(routeItem.children, groupPath, groupName);
                    } else {
                        let cleanedPath = groupPath;
                        if (cleanedPath.length > 1 && cleanedPath.endsWith('/')) {
                            cleanedPath = cleanedPath.slice(0, -1);
                        }
                        routeMap[groupName] = cleanedPath;
                        _routeInfo[groupName] = {
                            template: cleanedPath,
                            params: routeItem.params || []
                        };
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing group '${group.prefix}':`, error);
        }
    }

    _routeMap = routeMap;
    _isInitialized = true;
    return _routeMap;
}

/**
 * Generates a URL string for a given route name and parameters.
 * Handles multiple path parameters and flexible parameter input.
 * @param {string} routeName - The name of the route.
 * @param {...any} args - Arguments can be path parameters, a single object containing all params, or a mix.
 * @returns {Promise<string>} The generated URL, or '#' if the route is not found.
 */
export default async function route(routeName, ...args) {
    const map = await _initializeRouteMap();
    const routeDetails = _routeInfo[routeName];

    if (!routeDetails) {
        console.warn(`Route name "${routeName}" not found.`);
        return '#';
    }

    let { template, params: pathParamsInTemplate } = routeDetails;
    let allParams = {};
    let queryParams = {};

    // --- Argument Parsing ---
    // Determine if the first argument after routeName is the params object or a path parameter.
    if (args.length > 0) {
        const firstArg = args[0];

        if (typeof firstArg === 'object' && firstArg !== null && !Array.isArray(firstArg)) {
            // Case 1: Single object contains all parameters (path and query)
            allParams = { ...firstArg };
        } else {
            // Case 2: Arguments are individual path parameters, potentially followed by a query object.
            // Identify which arguments are path parameters based on routeDetails.params
            const potentialPathParams = pathParamsInTemplate || [];

            // Assign arguments to path parameters
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (i < potentialPathParams.length) {
                    const paramName = potentialPathParams[i];
                    allParams[paramName] = arg;
                } else if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
                    // If we encounter an object and have already assigned all expected path params,
                    // assume it's the query parameters object.
                    queryParams = { ...arg };
                } else {
                    console.warn(`Unexpected argument type for route "${routeName}":`, arg);
                }
            }
        }
    }

    // Ensure all path parameters from the template are present in allParams,
    // even if not explicitly passed (though this is usually an error).
    // We use the identified pathParamsInTemplate for this.
    pathParamsInTemplate.forEach(paramName => {
        if (allParams[paramName] === undefined) {
            // Try to find it in the remaining args if they were provided individually
            // This part is tricky with mixed argument types. Let's rely on the object approach for now,
            // or ensure all path params are explicitly passed in the object.

            // If we are in the object-based parsing and a path param is missing, it's an error.
            if (args.length === 1 && typeof args[0] === 'object') {
                console.warn(`Path parameter "${paramName}" is missing for route "${routeName}".`);
            }
            // If args were individual, and we assigned them, `allParams` should already contain them if passed.
            // If not passed, it remains undefined.
        }
    });

    // --- URL Construction ---
    let url = template;

    // Replace path parameters
    for (const paramName of pathParamsInTemplate) {
        const placeholder = `:${paramName}`;
        if (allParams[paramName] !== undefined) {
            url = url.replace(placeholder, allParams[paramName]);
        } else {
            // If a path parameter is missing, we might want to throw an error or return a specific string.
            // For now, we'll leave the placeholder in the URL, which is usually undesirable.
            console.warn(`Path parameter "${paramName}" not provided for route "${routeName}".`);
        }
    }

    // Collect query parameters:
    // 1. From the `queryParams` object directly.
    // 2. From `allParams` where the key is NOT a path parameter.
    const finalQueryParams = { ...queryParams }; // Start with explicitly provided query params

    for (const key in allParams) {
        if (!pathParamsInTemplate.includes(key)) {
            // If this parameter is NOT one of the path parameters for this route, add it to query params.
            finalQueryParams[key] = allParams[key];
        }
    }

    const queryStringParts = Object.keys(finalQueryParams)
        .filter(key => finalQueryParams[key] !== undefined && finalQueryParams[key] !== null) // Filter out undefined/null values
        .map(key => `${key}=${finalQueryParams[key]}`);

    if (queryStringParts.length > 0) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}${queryStringParts.join('&')}`;
    }

    // Remove trailing slash if it's not the root path '/'
    if (url.length > 1 && url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    return url;
}

// Example Usage:
async function testRoutes() {
    console.log("Initializing routes...");
    await _initializeRouteMap(); // Ensure map is initialized

    console.log("\n--- Testing route('admin.user.posts.show', {userId:12, postId:15,flag:24}) ---");
    const url1 = await route('admin.user.posts.show', {userId:12, postId:15, flag:24});
    console.log(`admin.user.posts.show with object: ${url1}`); // Expected: admin/user/12/posts/15?flag=24

    console.log("\n--- Testing route('admin.user.posts.show', 12, 15, {flag:24}) ---");
    const url2 = await route('admin.user.posts.show', 12, 15, {flag:24});
    console.log(`admin.user.posts.show with multiple args: ${url2}`); // Expected: admin/user/12/posts/15?flag=24

    console.log("\n--- Testing route('admin.users.show', {id: 12, flag: 35}) ---"); // Using the older route structure
    const url3 = await route('admin.users.show', {id: 12, flag: 35});
    console.log(`admin.users.show with object: ${url3}`); // Expected: admin/users/12?flag=35 (or similar, depends on exact structure)

    console.log("\n--- Testing route('admin.users.show', 12, {flag: 35}) ---"); // Using the older route structure with multiple args
    const url4 = await route('admin.users.show', 12, {flag: 35});
    console.log(`admin.users.show with multiple args: ${url4}`); // Expected: admin/users/12?flag=35

    console.log("\n--- Testing route('admin.orders.show', {id: 101}) ---");
    const url5 = await route('admin.orders.show', {id: 101});
    console.log(`admin.orders.show with object: ${url5}`); // Expected: admin/orders/101

    console.log("\n--- Testing route('admin.orders.show', 101) ---");
    const url6 = await route('admin.orders.show', 101);
    console.log(`admin.orders.show with single arg: ${url6}`); // Expected: admin/orders/101
}

// Uncomment to run tests when this script is executed directly
// testRoutes();
