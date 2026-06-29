const routeGroups = [
    {
        prefix: "admin", // URL prefix for this group
        name: "admin.", // Name prefix for nested routes
        // middleware: ["auth"], // Example: could add middleware here if needed
        routes:async ()=>import('@/admin/route/routes')
    }/*,
    {
        prefix: "client", // URL prefix for this group
        name: "client.", // Name prefix for nested routes
        // middleware: ["auth"], // Example: could add middleware here if needed
        routes:()=>import('@/client/route/routes')
    },*/
];

export default routeGroups
