<?php

namespace Modules\Core\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('currencies')->truncate();

        DB::table('currencies')->insert([
            ['id'=>1,'name'=>'Iranian Rial','code'=>'IRR','symbol'=>'﷼'],
            ['id'=>2,'name'=>'US Dollar','code'=>'USD','symbol'=>'$'],
            ['id'=>3,'name'=>'Euro','code'=>'EUR','symbol'=>'€'],
            ['id'=>4,'name'=>'Turkish Lira','code'=>'TRY','symbol'=>'₺'],
            ['id'=>5,'name'=>'British Pound','code'=>'GBP','symbol'=>'£'],
            ['id'=>6,'name'=>'Canadian Dollar','code'=>'CAD','symbol'=>'$'],
            ['id'=>7,'name'=>'Saudi Riyal','code'=>'SAR','symbol'=>'﷼'],
            ['id'=>8,'name'=>'UAE Dirham','code'=>'AED','symbol'=>'د.إ'],
            ['id'=>9,'name'=>'Indian Rupee','code'=>'INR','symbol'=>'₹'],
            ['id'=>10,'name'=>'Swiss Franc','code'=>'CHF','symbol'=>'CHF'],
            ['id'=>11,'name'=>'Qatari Riyal','code'=>'QAR','symbol'=>'ر.ق'],
            ['id'=>12,'name'=>'Omani Rial','code'=>'OMR','symbol'=>'ر.ع.'],
            ['id'=>13,'name'=>'Bahraini Dinar','code'=>'BHD','symbol'=>'.د.ب'],
            ['id'=>14,'name'=>'Kuwaiti Dinar','code'=>'KWD','symbol'=>'د.ك'],
            ['id'=>15,'name'=>'Afghan Afghani','code'=>'AFN','symbol'=>'؋'],
            ['id'=>16,'name'=>'Iraqi Dinar','code'=>'IQD','symbol'=>'ع.د'],
            ['id'=>17,'name'=>'Pakistani Rupee','code'=>'PKR','symbol'=>'₨'],
            ['id'=>18,'name'=>'Azerbaijani Manat','code'=>'AZN','symbol'=>'₼'],
        ]);
    }
}
