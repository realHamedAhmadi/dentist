<?php

use Modules\Core\Models\DevSetting;
use Modules\Core\Enums\CalendarType;

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

