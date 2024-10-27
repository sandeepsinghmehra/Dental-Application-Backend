import { getDistance } from "geolib";
import responseMessage from "../../constants/responseMessage";
import { TryCatch } from "../../middlewares/tryCatch";
import { User } from "../../models/user";
import httpResponse from "../../utils/httpResponse";
import ErrorHandler from "../../utils/utility";

import doctors from "../../dummyData/doctor"



const getAllDoctorsListService = TryCatch(async (req:any, res, next) => {
    const { sourceCoords } = req.body;
    const user:any = await User.findById({ _id: req.userId });

    if(user.role !== "patient") return next(new ErrorHandler("You are not a patient", 400));
    // console.log("user", user);

    const destinationCoords = [
        { latitude: 45.006, longitude: 87.093 },
        { latitude: 65.006, longitude: 84.093 },
        { latitude: 75.006, longitude: 87.093 },
        { latitude: 85.006, longitude: 80.093 },
        { latitude: 85.006, longitude: 77.093 },
    ];

    const doctorsList = doctors;

    console.log("doctorsList: ", doctorsList);
    
    // const response = destinationCoords.map((dest) => {
    //     // const distance = haversine(sourceCoords, dest); // Distance in meters
    //     // Calculate the distance using geolib
    //     const distanceInMeters = getDistance(sourceCoords, dest);
    //     const distanceInKilometers = distanceInMeters / 1000; // Convert meters to kilometers

    //     return {
    //         sourceCoords,
    //         destinationCoords: dest,
    //         distance: distanceInKilometers,
    //         distanceIn: 'Kilometer',
    //         otherInfo: "Additional information can go here",
    //     };
    // }).sort((a, b) => a.distance - b.distance); // Sort by distance in ascending order

    const response = doctorsList.map((item:any) => {
        const destinationCoords = item.profile.address.location.coordinates;
        // const distance = haversine(sourceCoords, dest); // Distance in meters
        // Calculate the distance using geolib
        const distanceInMeters = getDistance(sourceCoords, destinationCoords);
        const distanceInKilometers = distanceInMeters / 1000; // Convert meters to kilometers

        return {
            sourceCoords,
            destinationCoords: destinationCoords,
            distance: distanceInKilometers,
            distanceIn: 'Kilometer',
            _id: item._id,
            mobile_number: item.mobile_number,
            role: item.role,
            verify_mobile_number: item.verify_mobile_number,
            verify_email_address: item.verify_email_address,
            status: item.status,
            countryCode: item.countryCode,
            profile: {
                firstName: item.profile?.firstName,
                middleName: item.profile?.middleName,
                lastName: item.profile?.lastName,
                bio: item.profile?.bio,
                gender: item.profile?.gender,
                address: {
                    street1: item.profile?.address?.street1,
                    street2: item.profile?.address?.street2,
                    city: item.profile?.address?.city,
                    state: item.profile?.address?.state,
                    country: item.profile?.address?.country,
                    zip: item.profile?.address?.zip
                },
            }
        };
    }).sort((a: any, b: any) => a.distance - b.distance); // Sort by distance in ascending order

    httpResponse(req, res, 200, responseMessage.SUCCESS, response);
});


export {
    getAllDoctorsListService, 
};