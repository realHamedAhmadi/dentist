import React from 'react'
import BaseTable from "@/shared/components/ui/Table";
import {TablePagination} from "@mui/material";
import PaginatedTable from "@/shared/components/ui/Table/PaginatedTable";
import SortableTable from "@/shared/components/ui/Table/SortableTable";
import FilterableTable from "@/shared/components/ui/Table/FilterableTable";
import CrudTable from "@/shared/components/ui/Table/CrudTable";
import ServerDrivenTable from "@/shared/components/ui/Table/ServerDrivenTable";
import route from "@/shared/utils/route";
import FixedCreatePageButton from "@/shared/components/ui/primitives/Button/FixedCreatePageButton";
const IndexPage:React.FC=()=>{
    const myColumns = [
        { id: 'name', label: 'نام' },
        { id: 'quantity', label: 'تعداد' },
        { id: 'price', label: 'قیمت' },
    ];
    const myData = [
        { id: 1, name: 'صندلی', quantity: 5, price: 150000 },
        { id: 2, name: 'میز', quantity: 2, price: 500000 },
    ];
    return(
        <>
            <div>User page</div>
            <FixedCreatePageButton to='/admin/clients/create' variant='contained'> {/*:route*/}
                تشکیل پرونده بیمار
            </FixedCreatePageButton>
        </>
    )
}

export default IndexPage
