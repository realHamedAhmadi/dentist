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
 * Returns module federation remote entries for the current environment.
 */
function latestPluginRemoteEntries($area='admin'): array
{
    $remotes=discoverProductionPluginRemoteEntries($area);
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
 * Discovers latest production plugin remote entries from dist/plugins.
 */
function discoverProductionPluginRemoteEntries($area='admin'): array
{
    $basePath = public_path('dist/plugins');

    if (!File::isDirectory($basePath)) {
        return [];
    }

    $entries = [];

    foreach (File::directories($basePath) as $pluginDirectory) {
        $pluginName = basename($pluginDirectory);
        $versions = array_map('basename', File::directories($pluginDirectory));

        if (empty($versions)) {
            continue;
        }

        usort($versions, static function (string $a, string $b): int {
            // Sort versions in descending order
            return version_compare($b, $a);
        });

        $latestVersion = $versions[0];
        $remoteEntry = $pluginDirectory. DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . $latestVersion . DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR. 'remoteEntry.js';
        if (!File::exists($remoteEntry)) {
            continue;
        }

        $entries[$pluginName] = [
            'entry' => 'dist/plugins/' . $pluginName . '/' . $area.'/' . $latestVersion . '/assets/remoteEntry.js',
            'version' => $latestVersion,
        ];
    }

    return $entries;
}


