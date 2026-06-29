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
 * This function is intended to be called once during application startup.
 * It processes route definitions from various groups, resolves paths,
 * and extracts parameter information, including optional parameters.
 *
 * @returns {Promise<object>} A promise that resolves to the generated route map.
 */
async function _initializeRouteMap() {
    // If the route map has already been initialized, return the cached version.
    if (_isInitialized) return _routeMap;

    const routeMap = {}; // Stores the mapping from route name to resolved path template.
    _routeInfo = {}; // Resets route info cache. Stores details about each route.

    /**
     * Recursively processes route items (which can be individual routes or route groups).
     * It resolves paths, extracts parameter names (required and optional), and populates
     * routeMap and _routeInfo. Handles the creation of duplicate route entries for optional parameters.
     *
     * @param {Array|object} items - An array or object containing route definitions.
     * @param {string} currentPathPrefix - The accumulated path prefix from parent groups/routes.
     * @param {string} currentNamePrefix - The accumulated name prefix from parent groups/routes.
     */
    /*async function processRouteItems(items, currentPathPrefix = '', currentNamePrefix = '') {
        // Ensure we are always working with an array of route items.
        const routesArray = Array.isArray(items) ? items : Object.values(items);

        for (const item of routesArray) {
            const itemPath = item.path || ''; // Get the path for the current item, default to empty string.
            // Ensure name is always a string, handle cases where it might be undefined or null.
            const itemNameSegment = item.name ? String(item.name) : '';
            // Concatenate prefixes to form the full name for this route/group.
            const finalNamePrefix = currentNamePrefix + itemNameSegment;

            // --- Start: Parameter Handling (Required and Optional) ---
            const pathSegments = (itemPath || '').split('/');
            const routeParams = { required: [], optional: [] }; // Object to hold required and optional parameters.
            let cleanedPathSegments = []; // Segments that will form the final path template.
            let hasOptionalParam = false; // Flag to indicate if any optional parameter exists in this item's path.

            for (const segment of pathSegments) {
                if (segment.startsWith(':')) { // Check if the segment is a parameter.
                    if (segment.endsWith('?')) { // Check if the parameter is optional.
                        const paramName = segment.substring(1, segment.length - 1); // Extract parameter name, removing ':' and '?'.
                        routeParams.optional.push(paramName);
                        hasOptionalParam = true;
                        // Keep the segment with '?' in cleanedPathSegments for clarity in the template,
                        // as the `route` function will handle its optional nature.
                        cleanedPathSegments.push(`:${paramName}?`);
                    } else { // It's a required parameter.
                        const paramName = segment.substring(1); // Extract parameter name, removing ':'.
                        routeParams.required.push(paramName);
                        cleanedPathSegments.push(segment); // Keep the required parameter segment.
                    }
                } else { // It's a static path segment.
                    cleanedPathSegments.push(segment);
                }
            }
            // Join the processed segments to form the resolved path template.
            const resolvedPath = joinPaths(currentPathPrefix, cleanedPathSegments.join('/'));
            // --- End: Parameter Handling ---


            if (item.children) {
                // If the item has children, it's a route group.
                const childPathPrefix = resolvedPath; // The path prefix for children is the resolved path of this group.
                // Recursively process the children, passing the updated path and name prefixes.
                await processRouteItems(item.children, childPathPrefix, finalNamePrefix);
            } else {
                // This is a leaf route (not a group).
                const finalName = finalNamePrefix; // The final name for this route.
                let routeTemplate = resolvedPath; // The initial template.

                // Clean up trailing slash if it's not the root path.
                if (routeTemplate.length > 1 && routeTemplate.endsWith('/')) {
                    routeTemplate = routeTemplate.slice(0, -1);
                }

                // --- New Logic for Handling Optional Parameters ---
                if (hasOptionalParam) {
                    // If the route has an optional parameter, we create two entries:
                    // 1. The route with the optional parameter (e.g., /posts/:postId?)
                    // 2. A route representing the path without the optional parameter (e.g., /posts)

                    // Entry 1: Route with the optional parameter.
                    routeMap[finalName] = routeTemplate;
                    _routeInfo[finalName] = {
                        template: routeTemplate, // Store the full template including optional param syntax.
                        params: routeParams, // Store both required and optional parameters.
                        isOptionalRoute: true // Flag indicating this entry handles an optional parameter.
                    };

                    // Entry 2: Route without the optional parameter.
                    // Remove the last segment (which is the optional parameter) to get the path without it.
                    const pathWithoutOptionalParam = routeTemplate.split('/').slice(0, -1).join('/');

                    // Use the same finalName for the route without the optional param,
                    // but ensure we don't overwrite if a different route is already mapped to this name/path.
                    // The name for the route without the optional parameter. This might need adjustment
                    // based on your naming conventions (e.g., posts.index vs. posts.post).
                    const optionalRouteName = finalName;
                    const optionalRouteTemplate = pathWithoutOptionalParam || '/'; // Handle root path case.

                    // Avoid overwriting if a route with this name/path already exists.
                    // This check prevents issues if, for example, a route like '/posts' was defined separately.
                    if (!routeMap[optionalRouteName] || routeMap[optionalRouteName] !== optionalRouteTemplate) {
                         routeMap[optionalRouteName] = optionalRouteTemplate;
                         _routeInfo[optionalRouteName] = {
                            template: optionalRouteTemplate, // Template without the optional param.
                            // Only required parameters are relevant here.
                            params: { required: routeParams.required, optional: [] },
                            isOptionalRoute: false // Flag indicating this entry does not handle an optional parameter directly.
                        };
                    }

                } else {
                    // If the route does not have an optional parameter, add it as a standard route.
                    routeMap[finalName] = routeTemplate;
                    _routeInfo[finalName] = {
                        template: routeTemplate,
                        // Store params in the consistent { required: [], optional: [] } format.
                        params: { required: routeParams.required, optional: routeParams.optional },
                        isOptionalRoute: false // Standard route, no optional param handling here.
                    };
                }
                 // --- End New Logic ---
            }
        }
    }
*/
    function processRouteItems(routeItems, currentPathPrefix = "", parentName = "") {
        for (const item of routeItems) {

            // Validate path
            const itemPath = item.path || "";
            if (typeof itemPath !== "string") {
                throw new Error("Route 'path' must be a string");
            }

            // Compute full path & route name
            const fullPath = `${currentPathPrefix}/${itemPath}`.replace(/\/+/g, "/");
            const fullName = parentName
                ? `${parentName}.${item.name}`
                : item.name;

            const segments = fullPath.split("/").filter(Boolean);
            const requiredParams = [];
            const optionalParams = [];

            // Scan route segments for parameters
            segments.forEach(seg => {
                if (seg.startsWith(":")) {
                    const param = seg.replace(":", "");
                    if (param.endsWith("?")) {
                        optionalParams.push(param.slice(0, -1)); // remove "?"
                    } else {
                        requiredParams.push(param);
                    }
                }
            });

            const hasOptionalParam =
                optionalParams.length > 0 &&
                segments[segments.length - 1].includes("?");

            const routeTemplates = [];
            const routeEntries = [];

            // ------------------------------------------------------------------
            // CASE 1: Route has OPTIONAL parameter
            // ------------------------------------------------------------------
            if (hasOptionalParam) {
                // Template with optional parameter
                const templateWithOptional = fullPath;
                routeTemplates.push(templateWithOptional);

                routeEntries.push({
                    template: templateWithOptional,
                    params: { required: requiredParams, optional: optionalParams },
                    isOptionalRoute: true
                });

                // Template WITHOUT optional parameter
                const templateWithoutOptional =
                    "/" + segments.slice(0, -1).join("/") || "/";

                routeTemplates.push(templateWithoutOptional);

                routeEntries.push({
                    template: templateWithoutOptional,
                    params: {
                        required: requiredParams,
                        optional: [] // optional removed
                    },
                    isOptionalRoute: false
                });

            } else {
                // ------------------------------------------------------------------
                // CASE 2: Normal route, no optional params
                // ------------------------------------------------------------------
                routeTemplates.push(fullPath);

                routeEntries.push({
                    template: fullPath,
                    params: { required: requiredParams, optional: [] },
                    isOptionalRoute: false
                });
            }

            routeMap[fullName] = routeTemplates;
            _routeInfo[fullName] = routeEntries;

            // Recursively process children
            if (Array.isArray(item.children)) {
                processRouteItems(item.children, fullPath, fullName);
            }
        }
    }

    // Iterate through each route group defined in `routeGroups`.
    for (const group of routeGroups) {
        try {
            // Dynamically import the routes module for the current group.
            // Assumes `group.routes` returns a Promise resolving to the route definitions.
            const importedModule = await group.routes();
            // Extract the default export or the module itself if no default export.
            const importedRoutes = importedModule.default || importedModule;

            if (Array.isArray(importedRoutes)) {
                // If the import results in an array, process it directly.
                // The base path for these routes is the group's prefix.
                await processRouteItems(importedRoutes, `/${group.prefix}`, group.name);
            } else if (typeof importedRoutes === 'object' && importedRoutes !== null) {
                // If the import results in an object, process its top-level routes.
                for (const key in importedRoutes) {
                    const routeItem = importedRoutes[key];
                    const basePath = routeItem.path || '';
                    // Construct the full path for this route item, combining group prefix and item path.
                    const groupPath = joinPaths(`/${group.prefix}`, basePath === '/' ? '' : basePath);
                    // Construct the full name for this route item.
                    const groupName = group.name + (routeItem.name || '');

                    if (routeItem.children) {
                        // If the item has children, process them recursively.
                        await processRouteItems(routeItem.children, groupPath, groupName);
                    } else {
                        // If it's a leaf route within the group object.
                        let cleanedPath = groupPath;
                        if (cleanedPath.length > 1 && cleanedPath.endsWith('/')) {
                            cleanedPath = cleanedPath.slice(0, -1);
                        }

                        // Store the route name and its cleaned path template.
                        routeMap[groupName] = cleanedPath;
                        _routeInfo[groupName] = {
                            template: cleanedPath,
                            // Use existing params or default to empty array.
                            params: routeItem.params || { required: [], optional: [] },
                             isOptionalRoute: false // Assuming routes defined directly in objects don't have optional params unless explicitly defined.
                        };
                    }
                }
            }
        } catch (error) {
            // Log any errors encountered during group processing.
            console.error(`Error processing group '${group.prefix}':`, error);
        }
    }

    // Cache the generated route map and set the initialized flag.
    _routeMap = routeMap;
    _isInitialized = true;
    // Return the populated route map.
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

    let { template, params: pathParamsInTemplate=[] } = routeDetails;
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
