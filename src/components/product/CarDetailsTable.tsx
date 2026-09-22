import React from "react";
import EndBidTimer from "./EndBidTimer";

const VehicleDetailsTable = ({ vehicle }: { vehicle: any }) => {
  return (
    <div className="overflow-x-auto bg-white  rounded-lg mb-8 md:-mt-8">
      <table className="w-full border-collapse border border-gray-200 text-sm text-left text-gray-700">
        <tbody>
          <tr className="bg-gray-50 border-b">
            <th className=" px-6 py-4 font-bold text-primary w-1/4">Make</th>
            <td className=" px-6 py-4 w-1/4">{vehicle?.make || "N/A"}</td>
            <th className=" px-6 py-4 font-bold text-primary w-1/4">Engine</th>
            <td className=" px-6 py-4 w-1/4">{vehicle?.engine || "N/A"}</td>
          </tr>
          <tr className="border-b">
            <th className=" px-6 py-4 font-medium text-gray-900">Model</th>
            <td className=" px-6 py-4">{vehicle?.model || "N/A"}</td>
            <th className=" px-6 py-4 font-medium text-gray-900">Drivetrain</th>
            <td className=" px-6 py-4">{vehicle?.drivetrain || "N/A"}</td>
          </tr>
          <tr className="bg-gray-50  border-b">
            <th className=" px-6 py-4 font-medium text-gray-900">Mileage</th>
            <td className=" px-6 py-4">{vehicle?.mileage || "N/A"}</td>
            <th className=" px-6 py-4 font-medium text-gray-900">
              Transmission
            </th>
            <td className=" px-6 py-4">{vehicle?.transmission || "N/A"}</td>
          </tr>
          <tr className="border-b">
            <th className=" px-6 py-4 font-medium text-gray-900">VIN</th>
            <td className=" px-6 py-4">{vehicle?.vin || "N/A"}</td>
            <th className=" px-6 py-4 font-medium text-gray-900">Body Style</th>
            <td className=" px-6 py-4">{vehicle?.bodyStyle || "N/A"}</td>
          </tr>
          <tr className="bg-gray-50  border-b">
            <th className=" px-6 py-4 font-medium text-gray-900">
              Title Status
            </th>
            <td className=" px-6 py-4">{vehicle?.titleStatus || "N/A"}</td>
            <th className=" px-6 py-4 font-medium text-gray-900">
              Exterior Color
            </th>
            <td className=" px-6 py-4">{vehicle?.exteriorColor || "N/A"}</td>
          </tr>
          <tr className="border-b">
            <th className=" px-6 py-4 font-medium text-gray-900">Location</th>
            <td className=" px-6 py-4">
              {vehicle?.location?.city || "Unknown"},{" "}
              {vehicle?.location?.zipCode || "N/A"}
            </td>
            <th className=" px-6 py-4 font-medium text-gray-900">
              Interior Color
            </th>
            <td className=" px-6 py-4">{vehicle?.interiorColor || "N/A"}</td>
          </tr>
          <tr className="bg-gray-50  border-b">
            <th className=" px-6 py-4 font-medium text-gray-900">Seller</th>
            <td className=" px-6 py-4">{vehicle?.seller?.name || "N/A"} </td>
            <th className=" px-6 py-4 font-medium text-gray-900">
              Seller Type
            </th>
            <td className=" px-6 py-4">{vehicle?.sellerType || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VehicleDetailsTable;
