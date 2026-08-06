import { cn } from "@/lib/utils";

type HeadLineProps = {
  title: string;
  className?: string;
  position?: "center" | "left" | "right";
};

const HeadLine = ({ title, className, position = "center" }: HeadLineProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        position === "center" && "justify-center text-center",
        position === "left" && "justify-start text-left",
        position === "right" && "justify-end text-right",
      )}
    >
      <span className="-scale-x-100 inline-block select-none">🌿</span>

      <h2
        className={cn(
          "text-2xl font-black text-gray-900 tracking-tight",
          className,
        )}
      >
        {title}
      </h2>

      <span className="select-none">🌿</span>
    </div>
  );
};

export default HeadLine;
