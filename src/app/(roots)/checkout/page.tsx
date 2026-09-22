"use client";
import React, { useState } from "react";

// icons
import { IoInformationCircleOutline } from "react-icons/io5";
import { LuPrinter } from "react-icons/lu";
import { FaRegCopy } from "react-icons/fa6";
import { Tooltip } from "antd";

const countries = [
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguilla" },
  { value: "AR", label: "Argentina" },
  // ... add more countries here
];
const PaymentCalculator = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCheckedOne, setIsCheckedOne] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const handleCheckboxChangeOne = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheckedOne(event.target.checked);
  };
  const handleCheckboxChangeTwo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheckedTwo(event.target.checked);
  };

  return (
    <div className="px-4 xl:mx-56">
      <div className="container mx-auto py-8 md:py-10">
        <div className="text-white text-center  ">
          <h2 className="  text-xl lg:text-3xl font-bold mb-2 mt-8">
            Payment Calculator
          </h2>
          <p className=" text-lg md:text-xl lg:text-3xl mt-1 mb-5">
            Find Out the Final Price for Any Vehicle
          </p>
        </div>

        {/* Processing  */}
        <div>
          <div className="flex items-center">
            <span className="w-10 h-10  p-2 flex  items-center justify-center border border-[#b8c3ca]   rounded-full">
              <span className="bg-white h-6 w-6 flex items-center justify-center    text-[#004979] rounded-full">
                1
              </span>
            </span>

            <div className="  w-full border-[0.2px] border-gray-100"></div>

            <span className="border p-2 h-6 w-6 flex items-center justify-center    text-white rounded-full">
              2
            </span>
            <div className="  w-full border-[0.2px] border-gray-100"></div>

            <span className="border p-2  h-6 w-6 flex items-center justify-center    text-gray-300   rounded-full">
              3
            </span>
          </div>
          <div className="w-full flex items-center">
            <h3 className=" text-nowrap font-bold text-white text-sm md:text-lg ">
              Shipping Quote
            </h3>
            <div className="  w-full "></div>
            <h3 className="text-nowrap  text-white text-sm md:text-lg">
              Complete Order
            </h3>
            <div className="  w-full  "></div>
            <h3 className="text-nowrap text-white text-sm md:text-lg">
              Order Placed
            </h3>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row   border-white border-2 rounded mt-5 overflow-hidden">
          {/* left section  */}
          <section className="md:w-1/2  w-full bg-white p-2 md:p-4 lg:p-10 md:space-y-4 space-y-2   text-xs md:text-md xl:text-lg ">
            {/* Lot or VIN */}
            <div className="flex md:items-center justify-between md:flex-row flex-col">
              <h3 className="text-nowrap mb-2   md:mb-0 ">Lot# or VIN</h3>
              <input
                className="md:w-[70%] w-full  p-3 md:p-4  rounded  outline-none border  focus:border-[#003399]  hover:bg-gray-200"
                placeholder="Enter Lot # or VIN "
                type="text"
                name=""
                id=""
              />
            </div>
            {/* Aucation Location  */}
            <div className="flex md:items-center justify-between md:flex-row flex-col">
              <h3 className="text-nowrap mb-2  md:mb-0 ">Vehicle Location</h3>

              <select
                disabled
                value={selectedCountry}
                onChange={handleChange}
                className="md:w-[70%] w-full  p-3 md:p-4  rounded  outline-none border  focus:border-[#003399]  hover:bg-gray-200"
              >
                <option value="">NY - NewBurgh</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* sheeping to country */}
            <div className="flex md:items-center justify-between md:flex-row flex-col">
              <h3 className="text-nowrap mb-2  md:mb-0 ">
                Shipping to Country
              </h3>

              <select
                value={selectedCountry}
                onChange={handleChange}
                className="md:w-[70%] w-full  p-3 md:p-4  rounded  outline-none border  focus:border-[#003399]  hover:bg-gray-200"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* port  */}
            <div className="flex md:items-center justify-between md:flex-row flex-col">
              <h3 className="text-nowrap mb-2  md:mb-0 ">Port</h3>

              <select
                value={selectedCountry}
                onChange={handleChange}
                className="md:w-[70%] w-full  p-3 md:p-4  rounded  outline-none border  focus:border-[#003399]  hover:bg-gray-200"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/*From Us port  */}
            <div className="flex md:items-center justify-between md:flex-row flex-col">
              <h3 className="text-nowrap mb-2  md:mb-0 ">From US Port</h3>

              <select
                disabled
                value={selectedCountry}
                onChange={handleChange}
                className="md:w-[70%] w-full  p-3 md:p-4  rounded  outline-none border  focus:border-[#003399]  hover:bg-gray-200"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Right Section */}
          <section className="md:w-1/2  w-full   ">
            {/* top section */}
            <section
              className="w-full
             bg-[#23618b] text-white"
            >
              <div className="lg:px-5 px-2 pt-2 lg:pt-5">
                {/* section title  */}
                <h2 className="font-bold   lg:text-xl  pb-2 my-2 text-white border-b-[0.5px] border-green-900">
                  SHIPPING ORDER
                </h2>
                {/* Shiiping INfo */}
                <div>
                  <div className="flex w-full flex-col gap-2 border-b-[0.5px] border-green-900 py-2 text-sm md:flex-row md:items-center md:justify-between md:text-md xl:text-lg">
                    <p className="flex items-start md:items-center">
                      Shipping to New Jersey, Nj (1 -3 days){" "}
                      <Tooltip
                        overlayInnerStyle={{
                          width: "18rem",
                        }}
                        placement="bottom"
                        title={
                          "Total Loss Coverage means that we will cover the fair market value of your vehicle as of the day of the loss, attributable to: fire or explosion, vessel stranded/capsized, overturning or derailment. Reimbursement is provided as CarClickBD credit and can be used toward the next purchase or service. Not applicable for moisture/weather condition damage. "
                        }
                        arrow={true}
                      >
                        <span className="text-gray-300 hover:text-white text-xl lg:text-2xl mt-1">
                          <IoInformationCircleOutline />
                        </span>
                      </Tooltip>
                    </p>

                    <h3 className="text-nowrap">
                      <span className="font-bold">$285</span> USD
                    </h3>
                  </div>

                  <div className="flex w-full flex-col gap-2 border-b-[0.5px] border-green-900 py-2 text-sm md:flex-row md:items-center md:justify-between md:text-md xl:text-lg">
                    <p className="flex items-start md:items-center">
                      Shipping to Luanda, AO (16-22 days)
                      <Tooltip
                        overlayInnerStyle={{
                          width: "30rem",
                        }}
                        placement="bottom"
                        title={
                          "We provide vehicle shipping services from the USA to your country. Your vehicle will be loaded into container and delivered to the port. Our representative will assist you with customs clearance. Cost of custom clearance and unloading are not included in shipping price. Ocean shipping rates are based on consolidation in 40ft container together with 1-3 vehicles. For other shipping types such as RORO or FCL, please contact us before we start working on your order. We offer only 30 days of free storage at our warehouses, after 30 days storage fees will apply. In case of pending documents, storage fees may be applied starting the 1st day of storage. "
                        }
                        arrow={true}
                      >
                        <span className="text-gray-300 hover:text-white text-xl lg:text-2xl mt-1">
                          <IoInformationCircleOutline />
                        </span>
                      </Tooltip>
                    </p>

                    <h3 className=" text-nowrap  ">
                      <span className="font-bold">$285</span> USD
                    </h3>
                  </div>

                  <div className="flex w-full flex-col gap-2 border-b-[0.5px] border-green-900 py-2 text-sm md:flex-row md:items-center md:justify-between md:text-md xl:text-lg">
                    <p className="flex items-start md:items-center">
                      Peak Season Surcharge
                      <Tooltip
                        overlayInnerStyle={{
                          width: "20rem",
                        }}
                        placement="bottom"
                        title={
                          "Surcharge that applies during times of peak demand. Peak Season Surcharge applied due to high congestion in the ports, drayage cost increase, and equipment shortage. "
                        }
                        arrow={true}
                      >
                        <span className="text-gray-300 hover:text-white text-xl lg:text-2xl mt-1">
                          <IoInformationCircleOutline />
                        </span>
                      </Tooltip>
                    </p>

                    <h3>
                      <span className="font-bold text-nowrap">$285</span> USD
                    </h3>
                  </div>
                </div>

                {/* Coverage */}
                <div className="space-y-5 md:space-y-0 pb- md:pb-0">
                  {/* Loss Coverage */}
                  <div className="flex w-full flex-col gap-2 border-green-900 py-2 md:min-h-[3.5rem] md:flex-row md:border-b-[0.5px] lg:items-center lg:justify-between">
                    <div className="flex items center gap-2 text-sm md:text-md xl:text-lg">
                      <input
                        type="checkbox"
                        id="show-number-input"
                        checked={isCheckedOne}
                        onChange={handleCheckboxChangeOne}
                        className="mt-1 focus:ring-white focus:border-blue-500 h-4 w-4 lg:h-5 lg:w-5"
                      />
                      <h2 className="flex items-center">
                        Total Loss Coverage (1.5%){" "}
                        <Tooltip
                          overlayInnerStyle={{
                            width: "20rem",
                          }}
                          placement="bottom"
                          title={
                            <span>
                              Total Loss Coverage means that we will cover the
                              fair market value of your vehicle as of the day of
                              the loss, attributable to: fire or explosion,
                              vessel stranded/capsized, overturning or
                              derailment. Reimbursement is provided as credit on
                              CarClickBD account and can be used toward the
                              next purchases or services. Not applicable for
                              moisture/weather condition damage.
                            </span>
                          }
                          arrow={true}
                        >
                          <span className="text-gray-300 hover:text-white text-xl lg:text-2xl mt-1">
                            <IoInformationCircleOutline />
                          </span>
                        </Tooltip>
                      </h2>
                    </div>
                    {isCheckedOne && (
                      <input
                        type="number"
                        id="number-input"
                        placeholder="Vehicle Value"
                        className="text-black  text-sm md:text-md  xl:text-lg border  border-gray-300 rounded-md  px-2 lg:px-3  w-full  py-1 md:py-0 md:w-40 md:h-10   focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                  {/* Full Coverage */}
                  <div className="flex w-full flex-col gap-2 border-green-900 py-2 md:min-h-[3.5rem] md:flex-row md:border-b-[0.5px] lg:items-center lg:justify-between">
                    <div className="flex items center gap-2 text-sm md:text-md xl:text-lg">
                      <input
                        type="checkbox"
                        id="show-number-input"
                        checked={isCheckedTwo}
                        onChange={handleCheckboxChangeTwo}
                        className="mt-1 focus:ring-white  focus:border-blue-500 h-4 w-4 lg:h-5 lg:w-5"
                      />
                      <h2 className="flex items-center">
                        Full Coverage (5%){" "}
                        <Tooltip
                          overlayInnerStyle={{
                            width: "20rem",
                          }}
                          placement="bottom"
                          title={
                            "Full Coverage means that we will provide you with reimbursement for mechanical damage. Deductible is $500. Reimbursement is provided as CarClickBD credit and can be used toward the next purchase or service. Not applicable for moisture/weather condition damage. "
                          }
                          arrow={true}
                        >
                          <span className="text-gray-300 hover:text-white text-xl lg:text-2xl mt-1">
                            <IoInformationCircleOutline />
                          </span>
                        </Tooltip>
                      </h2>
                    </div>
                    {isCheckedTwo && (
                      <input
                        type="number"
                        id="number-input"
                        placeholder="Vehicle Value"
                        className="text-black  text-sm md:text-md  xl:text-lg border  border-gray-300 rounded-md  px-2 lg:px-3  w-full  py-1 md:py-0 md:w-40 md:h-10   focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
            {/* bottom section  */}
            <section className="w-full bg-[#004979] p-4 text-sm text-white md:p-5 md:text-lg lg:text-xl">
              <h2 className="flex items-center justify-between font-semibold ">
                <span>Total Price</span>{" "}
                <span className="font-bold text-xl lg:text-2xl">
                  $3,885 USD
                </span>
              </h2>
              <button className="py-3 text-sm md:text-md xl:text-lg text-center text-gray-800 font-bold mt-5 w-full rounded-full bg-orange-400 hover:bg-orange-300 transition-colors duration-300">
                ORDER SHIPPING
              </button>

              <div className="my-5 flex items-center gap-5">
                <button className="flex items-center gap-1 text-xl lg:text-2xl">
                  <LuPrinter />{" "}
                  <span className="hover:underline text-sm  md:text-lg lg:text-xl">
                    Print
                  </span>
                </button>
                <button className="flex items-center gap-1 text-xl lg:text-2xl">
                  <FaRegCopy />{" "}
                  <span className="hover:underline text-sm md:text-lg lg:text-xl">
                    Copy
                  </span>
                </button>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalculator;
