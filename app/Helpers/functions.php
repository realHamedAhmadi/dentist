<?php
use Illuminate\Support\Facades\App;
use Modules\Core\Models\DevSetting;
use Modules\Core\Enums\CalendarType;
use Illuminate\Support\Facades\File;


if (!function_exists('toGregorian')) {
    function toGregorian($date, $format = 'Y-m-d'): ?string
    {
        if ($date == 'today')
            return date($format);
        return match (DevSetting::calendar()) {
            CalendarType::JALALI->value => jDateTime::createDatetimeFromFormat($format, $date)
                ->format($format),
            CalendarType::HIJRI->value => null,
            default => null,
        };
    }
}

if (!function_exists('toJalali')) {
    function toJalali($date = null, $format = 'Y-m-d'): ?string
    {
        if ($date)
            return jDateTime::date($format, $date == 'today' ? null : $date);
        return null;
    }
}

if (!function_exists('toLocalCalendar')) {
    function toLocalCalendar($date = null, $format = 'Y-m-d'): ?string
    {
        switch (DevSetting::calendar()) {
            case CalendarType::JALALI->value:
                return toJalali($date, $format);
            case CalendarType::HIJRI->value:
                return null;
        }
        if ($date == 'today')
            return date($format);

        return $date;
    }
}

if (!function_exists('apiVersion')) {
    function apiVersion(): ?string
    {
        return app('api.version');
    }
}

if (!function_exists('getVersionResponseClass')) {
    function getVersionResponseClass(): ?string
    {
        $v = strtoupper(apiVersion()) ?: 'V1';
        return "Modules\\Core\\Http\\Responses\\Api\\{$v}\\VersionResponse";
    }
}


/**
 * Retrieves the latest remote entries for plugins based on the specified area.
 *
 * @param string $area
 * @return array
 */
function latestPluginRemoteEntries(string $area = 'admin'): array
{
    $remotes = discoverProductionPluginRemoteEntries($area);

    // Check if the application environment is local to prepend the base URL
    if (App::environment('local')) {
        return array_map(
            static function (array $remote): array {
                $remote['entry'] = url($remote['entry']);

                return $remote;
            },
            $remotes
        );
    }

    return $remotes;
}

/**
 * Discovers the latest production plugin remote entries from the dist/plugins directory.
 *
 * @param string $area
 * @return array
 */
function discoverProductionPluginRemoteEntries(string $area = 'admin'): array
{
    $basePath = public_path('dist/plugins');

    // Return empty array if the plugins directory does not exist
    if (!File::isDirectory($basePath)) {
        return [];
    }

    $entries = [];

    // Iterate through each plugin directory
    foreach (File::directories($basePath) as $pluginDirectory) {
        $pluginName = basename($pluginDirectory);

        // Target the specific area directory inside the plugin (e.g., plugins/client/admin)
        $areaPath = $pluginDirectory . DIRECTORY_SEPARATOR . $area;
        if (!File::isDirectory($areaPath)) {
            continue;
        }

        // Retrieve all version directories inside the area path
        $versions = array_map('basename', File::directories($areaPath));

        if (empty($versions)) {
            continue;
        }

        // Sort versions in descending order to get the latest version first
        usort($versions, static function (string $a, string $b): int {
            return version_compare($b, $a);
        });

        $latestVersion = $versions[0];

        // Construct the absolute path to the remoteEntry.js file
        $remoteEntry = $areaPath . DIRECTORY_SEPARATOR . $latestVersion . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'remoteEntry.js';

        if (!File::exists($remoteEntry)) {
            continue;
        }

        // Map the discovered plugin remote entry details
        $entries[$pluginName] = [
            'entry' => 'dist/plugins/' . $pluginName . '/' . $area . '/' . $latestVersion . '/assets/remoteEntry.js',
            'version' => $latestVersion,
        ];
    }

    return $entries;
}



