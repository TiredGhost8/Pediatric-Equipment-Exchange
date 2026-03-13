import Link from "next/link";

export default async function Gallery() {
        return (
            <>
            <div> Gallery Here </div>
            <div> <Link href= {"/scanner"}> Go to Scan Page </Link> </div> </>);
}