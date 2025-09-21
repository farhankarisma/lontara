"use client";

import Image from "next/image";
import Button from "./components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/login");
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: "url('/background.svg')",
      }}
    >
      <div className="flex flex-col justify-center items-center gap-5">
        <Image
          src="/logo_lontara.svg"
          width={500}
          height={300}
          alt="Lontara Logo"
        />
        <p className="text-xl">Arsip Cerdas, Waktu Lebih Hemat</p>
        <Button onClick={handleButtonClick}>Login</Button>
      </div>
    </div>
  );
}
