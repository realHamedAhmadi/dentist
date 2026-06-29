<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ResolveApiVersion
{
    public function handle(Request $request, Closure $next)
    {
        $segment = $request->segment(2);

        $version=null;
        if ($segment && $segment[0] === 'v' && ctype_digit(substr($segment, 1))) {
            $version = $segment;
        }

        app()->instance('api.version', strtolower($version?:config('app.api_default_version')));

        return $next($request);
    }
}

