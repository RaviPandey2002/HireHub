import { HomepageButtonControls } from "@/components/homePageButtonControls";
import Image from "next/image";
import HeroImage from "../../../public/HireHubLandingPageImage.png"

const LandingPage = ({ user, profileInfo }) => {
  return (
    <>
      <section className="relative w-full h-full min-h-screen pb-10">
        <div className="w-full h-full relative">
          <div className="flex flex-col-reverse lg:flex-row gap-10">
            <section className="w-full lg:w-[50%] flex flex-col md:px-2 lg:px-0 p-5 lg:p-10">
              <div className="w-full flex justify-start flex-col h-auto lg:pt-7">
                <span className="flex space-x-2">
                  <span className="block w-14 mb-2 dark:border-white border-b-2 border-gray-700"></span>
                  {!user ? <span className="font-medium dark:text-white text-gray-600">
                    One Stop Solution to Find Jobs & Candidates.
                  </span>
                    : profileInfo === "Candidate" ? <span className="font-medium dark:text-white text-gray-600">
                      One Stop Solution to Find Jobs for you.
                    </span> : <span className="font-medium dark:text-white text-gray-600">
                      One Stop Solution to Find Best Candidates for your jobs.
                    </span>
                  }
                </span>
                <h1 className="text-3xl dark:text-white mt-5 lg:text-7xl text-black font-extrabold">
                  Build your best job community starting from here.
                </h1>
                <div className="w-full mt-6 flex items-center text-white justify-start gap-2">
                  <HomepageButtonControls
                    user={JSON.parse(JSON.stringify(user))}
                    profileInfo={profileInfo}
                  />
                </div>
              </div>
            </section>
            <section className="w-full lg:w-[50%] flex flex-col md:px-2 lg:px-0 p-5 lg:p-10">
              <Image
                height={800}
                width={800}
                quality={100}
                priority={true}
                src="/images/HireHubLandingPageImage.png"
                alt="Hero Image Here"
                className="h-[88%] object-contain z-10"
              />
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingPage;