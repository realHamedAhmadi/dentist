import AdminAppBar from "@/admin/layouts/components/AdminAppBar";
const Header = ({onDrawerToggle}) => {
    const placeholder='جستجو...';
    return (
        <AdminAppBar onDrawerToggle={onDrawerToggle} placeholder={placeholder} color={'primary'} appTitle='M'/>
    )
}

export default Header
