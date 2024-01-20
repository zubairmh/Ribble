"use client"
import CustomCanvas from "@/components/CustomCanvas";
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col gap-4 min-h-screen bg-black text-white p-36">
      <div className="flex flex-row grow">
        <div className="basis-3/4 flex bg-red-400">
            <CustomCanvas className="w-full"></CustomCanvas>
        </div>
        <div className="basis-1/4 flex bg-green-400" />
      </div>
      <div className="flex w-[50%] h-16 bg-purple-500" />
    </div>
  );
}
