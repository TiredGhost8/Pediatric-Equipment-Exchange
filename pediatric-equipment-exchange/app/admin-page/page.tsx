import SideBar from "@/components/sidebar";

export default function AdminPage() {
    return ( <> 
        <div className = "flex">
            <SideBar />
            <main className = "flex-1 p-4">
                <h1 className="text-2xl"> Admin Page </h1>
            </main>
        </div>
        </>)
}
