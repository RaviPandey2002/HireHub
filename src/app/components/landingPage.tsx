import { HomepageButtonControls } from "@/components/homePageButtonControls";
import Image from "next/image";

export const LandingPage = ({ user, profileInfo }) => {
  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] w-full items-center overflow-hidden py-6 sm:py-10 lg:py-12 xl:py-16">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1500px]">
        <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-12 xl:gap-16">
          <section className="flex w-full flex-col px-4 sm:px-6 lg:w-[48%] lg:px-10 xl:px-12">
            <div className="flex w-full flex-col justify-center lg:pt-7">
              <span className="flex items-start gap-2">
                <span className="mt-3 block w-10 shrink-0 border-b-2 border-gray-700 dark:border-white sm:w-14"></span>
                {!user ? (
                  <span className="text-sm font-medium text-gray-600 dark:text-white sm:text-base lg:text-lg">
                    One Stop Solution to Find Jobs & Candidates.
                  </span>
                ) : profileInfo === "Candidate" ? (
                  <span className="text-sm font-medium text-gray-600 dark:text-white sm:text-base lg:text-lg">
                    One Stop Solution to Find Jobs for you.
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-600 dark:text-white sm:text-base lg:text-lg">
                    One Stop Solution to Find Best Candidates for your jobs.
                  </span>
                )}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-black dark:text-white sm:mt-5 sm:text-5xl lg:text-7xl 2xl:text-8xl">
                Build your best job community starting from here.
              </h1>
              <div className="mt-6 flex w-full items-center justify-start text-white">
                <HomepageButtonControls
                  user={JSON.parse(JSON.stringify(user))}
                  profileInfo={profileInfo}
                />
              </div>
            </div>
          </section>
          <section className="flex w-full justify-center px-4 sm:px-6 lg:w-[52%] lg:px-10 xl:px-12">
            <Image
              height={800}
              width={800}
              quality={100}
              priority={true}
              src="/images/HireHubLandingPageImage.png"
              alt="Hero Image Here"
              className="z-10 h-auto max-h-[42vh] w-full max-w-sm object-contain sm:max-h-[48vh] sm:max-w-md lg:max-h-[74vh] lg:max-w-xl xl:max-h-[78vh] xl:max-w-2xl 2xl:max-w-3xl"
            />
          </section>
        </div>
      </div>
    </section>
  );
}
