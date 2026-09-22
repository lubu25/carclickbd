import Image from "next/image";

const NoDatafound = () => {
  return (
    <>
      <div className="flex h-screen justify-center w-full items-center opacity-80 animate-pulse">
        <Image
          className="-mt-20 scale-75"
          alt="no data found"
          src="/assets/shared/no-data-found.png"
          width={500}
          height={500}
        />
      </div>
    </>
  );
};

export default NoDatafound;
