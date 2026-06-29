import React from 'react'
import FixedCreatePageButton from "@/core/shared/components/ui/primitives/Button/FixedCreatePageButton";
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
