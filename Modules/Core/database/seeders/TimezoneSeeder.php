<?php

namespace Modules\Core\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TimezoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       DB::table('timezones')->truncate();
       DB::table('timezones')->insert($this->data());
    }

    protected function data()
    {
        return [
            ['name' => 'Coordinated Universal Time', 'abbreviation' => 'UTC', 'offset' => '+00:00'],
            ['name' => 'Africa/Abidjan', 'abbreviation' => 'GMT', 'offset' => '+00:00'],
            ['name' => 'Africa/Accra', 'abbreviation' => 'GMT', 'offset' => '+00:00'],
            ['name' => 'Africa/Addis_Ababa', 'abbreviation' => 'EAT', 'offset' => '+03:00'],
            ['name' => 'Africa/Algiers', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Africa/Cairo', 'abbreviation' => 'EET', 'offset' => '+02:00'],
            ['name' => 'Africa/Casablanca', 'abbreviation' => 'WET', 'offset' => '+00:00'],
            ['name' => 'Africa/Johannesburg', 'abbreviation' => 'SAST', 'offset' => '+02:00'],
            ['name' => 'Africa/Lagos', 'abbreviation' => 'WAT', 'offset' => '+01:00'],
            ['name' => 'Africa/Nairobi', 'abbreviation' => 'EAT', 'offset' => '+03:00'],
            ['name' => 'America/Anchorage', 'abbreviation' => 'AKST', 'offset' => '-09:00'],
            ['name' => 'America/Argentina/Buenos_Aires', 'abbreviation' => 'ART', 'offset' => '-03:00'],
            ['name' => 'America/Chicago', 'abbreviation' => 'CST', 'offset' => '-06:00'],
            ['name' => 'America/Denver', 'abbreviation' => 'MST', 'offset' => '-07:00'],
            ['name' => 'America/Los_Angeles', 'abbreviation' => 'PST', 'offset' => '-08:00'],
            ['name' => 'America/Mexico_City', 'abbreviation' => 'CST', 'offset' => '-06:00'],
            ['name' => 'America/New_York', 'abbreviation' => 'EST', 'offset' => '-05:00'],
            ['name' => 'America/Toronto', 'abbreviation' => 'EST', 'offset' => '-05:00'],
            ['name' => 'America/Vancouver', 'abbreviation' => 'PST', 'offset' => '-08:00'],
            ['name' => 'Asia/Baghdad', 'abbreviation' => 'AST', 'offset' => '+03:00'],
            ['name' => 'Asia/Bahrain', 'abbreviation' => 'GST', 'offset' => '+03:00'],
            ['name' => 'Asia/Bangkok', 'abbreviation' => 'ICT', 'offset' => '+07:00'],
            ['name' => 'Asia/Beirut', 'abbreviation' => 'EET', 'offset' => '+02:00'],
            ['name' => 'Asia/Calcutta', 'abbreviation' => 'IST', 'offset' => '+05:30'],
            ['name' => 'Asia/Colombo', 'abbreviation' => 'SLST', 'offset' => '+05:30'],
            ['name' => 'Asia/Damascus', 'abbreviation' => 'EET', 'offset' => '+02:00'],
            ['name' => 'Asia/Dhaka', 'abbreviation' => 'BST', 'offset' => '+06:00'],
            ['name' => 'Asia/Dubai', 'abbreviation' => 'GST', 'offset' => '+04:00'],
            ['name' => 'Asia/Ho_Chi_Minh', 'abbreviation' => 'ICT', 'offset' => '+07:00'],
            ['name' => 'Asia/Hong_Kong', 'abbreviation' => 'HKT', 'offset' => '+08:00'],
            ['name' => 'Asia/Istanbul', 'abbreviation' => 'TRT', 'offset' => '+03:00'],
            ['name' => 'Asia/Jakarta', 'abbreviation' => 'WIB', 'offset' => '+07:00'],
            ['name' => 'Asia/Jerusalem', 'abbreviation' => 'IDT', 'offset' => '+03:00'],
            ['name' => 'Asia/Kabul', 'abbreviation' => 'AFT', 'offset' => '+04:30'],
            ['name' => 'Asia/Karachi', 'abbreviation' => 'PKT', 'offset' => '+05:00'],
            ['name' => 'Asia/Kathmandu', 'abbreviation' => 'NPT', 'offset' => '+05:45'],
            ['name' => 'Asia/Kolkata', 'abbreviation' => 'IST', 'offset' => '+05:30'],
            ['name' => 'Asia/Kuala_Lumpur', 'abbreviation' => 'MYT', 'offset' => '+08:00'],
            ['name' => 'Asia/Manila', 'abbreviation' => 'PST', 'offset' => '+08:00'],
            ['name' => 'Asia/Mecca', 'abbreviation' => 'AST', 'offset' => '+03:00'],
            ['name' => 'Asia/Shanghai', 'abbreviation' => 'CST', 'offset' => '+08:00'],
            ['name' => 'Asia/Singapore', 'abbreviation' => 'SGT', 'offset' => '+08:00'],
            ['name' => 'Asia/Taipei', 'abbreviation' => 'CST', 'offset' => '+08:00'],
            ['name' => 'Asia/Tehran', 'abbreviation' => 'IRST', 'offset' => '+03:30'],
            ['name' => 'Asia/Tokyo', 'abbreviation' => 'JST', 'offset' => '+09:00'],
            ['name' => 'Asia/Yangon', 'abbreviation' => 'MMT', 'offset' => '+06:30'],
            ['name' => 'Europe/Amsterdam', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Athens', 'abbreviation' => 'EET', 'offset' => '+02:00'],
            ['name' => 'Europe/Belgrade', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Berlin', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Brussels', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Bucharest', 'abbreviation' => 'EET', 'offset' => '+02:00'],
            ['name' => 'Europe/Budapest', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Copenhagen', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Dublin', 'abbreviation' => 'GMT', 'offset' => '+00:00'],
            ['name' => 'Europe/Lisbon', 'abbreviation' => 'WET', 'offset' => '+00:00'],
            ['name' => 'Europe/London', 'abbreviation' => 'GMT', 'offset' => '+00:00'],
            ['name' => 'Europe/Madrid', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Moscow', 'abbreviation' => 'MSK', 'offset' => '+03:00'],
            ['name' => 'Europe/Oslo', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Paris', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Prague', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Rome', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Stockholm', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Europe/Zurich', 'abbreviation' => 'CET', 'offset' => '+01:00'],
            ['name' => 'Pacific/Auckland', 'abbreviation' => 'NZST', 'offset' => '+12:00'],
            ['name' => 'Pacific/Fiji', 'abbreviation' => 'FJT', 'offset' => '+12:00'],
            ['name' => 'Pacific/Honolulu', 'abbreviation' => 'HST', 'offset' => '-10:00'],
            ['name' => 'Pacific/Port_Moresby', 'abbreviation' => 'PGT', 'offset' => '+10:00'],
            ['name' => 'Pacific/Samoa', 'abbreviation' => 'SST', 'offset' => '-11:00'],
        ];
    }
}
