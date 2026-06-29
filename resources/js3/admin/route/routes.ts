// admin group routes

// Define the structure of your routes, similar to Laravel's web.php
export const appRoutes = [
    {
        path: "/users/:userId/posts/:id",
        name: "users.index",
        element: "UsersListPage",
    },
    {
        // Nested route example
        path: "/users/:id",
        name: "users.show",
        element: "UserShowPage",
    },
    {
        // Route with optional parameter
        path: "/posts/:postId?",
        name: "posts.show",
        element:"PostShowPage",
    },
    {
        // Example of grouping routes under 'admin'
        group: "orders",
        name:"orders.",
        children: [
            {
                path: "/",
                name: "index",
                element: "OrderListPage",
            },
            {
                path: "/:id",
                name: "show",
                element: "OrderShowPage",
            },
            // More orders routes here...
        ],
    },
    {
        path: "/search",
        name: "search",
        element: "SearchPage",
    },
    // Add more top-level routes or groups as needed
];

export default appRoutes
// export :
/*
* {
    "admin.users.index":"admin/users"
    "admin.users.show":"admin/users/?id",
    "admin.orders.index":"admin/orders",
    "admin.orders.show":"admin/orders/?id",
 }
*
* */

