import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="w-full h-[95vh] flex justify-center align-center rounded-2xl bg-secondary">
      <Link href="/IA">
        <img src="/Wally.png" className="animationForIAWallyImg" />
      </Link>
    </div>
  );
}

export default page;
