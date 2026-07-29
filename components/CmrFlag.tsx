import { Star } from "lucide-react"

const CmrFlag = () => {
  
  return (
    <div className={"absolute top-0 left-0 grid h-2 w-full grid-cols-3"}>
      <div className={"h-full bg-green-800"}></div>
      <div className={"flex h-full items-center justify-center bg-red-600"}>
        <Star fill={"#fcc800"} className={"h-1.5 w-1.5 text-yellow-400"} />
      </div>
      <div className={"h-full bg-yellow-400"}></div>
    </div>
  )
};

export default CmrFlag;