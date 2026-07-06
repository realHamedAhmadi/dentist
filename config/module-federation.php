<?php
return [
    'dev_remotes' => [
        'order' => [
            'entry' => env('MF_REMOTE_ORDER_ENTRY', 'http://localhost:4173/assets/remoteEntry.js'),
            'version' => 'dev',
        ],
        'client' => [
            'entry' => env('MF_REMOTE_USER_ENTRY', 'http://localhost:4174/assets/remoteEntry.js'),
            'version' => 'dev',
        ],
    ],
];

