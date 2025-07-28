import Button from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="bg-gaming-black flex items-center justify-center p-4 overflow-hidden relative">
      <div className="text-center z-10 max-w-md">
        <h1 className="text-2xl font-bold text-gaming-white mb-6 tracking-wider font-orbitron">
          ACCESS <span className="text-gaming-electric-blue">DENIED</span>
        </h1>
        <p className="text-gaming-blue mb-8 font-sans text-sm">
          You dont have permission to do this.
        </p>
        <Link href="/login" className="block">
          <Button>Authenticate</Button>
        </Link>
      </div>
    </div>
  );
}
