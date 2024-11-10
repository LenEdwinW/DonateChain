import React from "react";
import Milestone from "../components/Milestone";

const charityDetails1 = {
    name: "Save the Ocean Foundation",
    description: "A charity focused on protecting marine life and reducing plastic waste in oceans.",
    milestone: {
        address: "0xA8E104f6dF81f68ad2C5c3431ed4e19b9646c400", 
        goal: "0.1",
        description: "Fund for beach clean-up activities and awareness programs.",
    },
};

const charityDetails2 = {
    name: "Children's Education Fund",
    description: "A charity that provides educational resources and scholarships for underprivileged children around the world.",
    milestone: {
        address: "0x20504E5eE08D3cD1Fb73Fe2287640CEb313e0f0e", 
        goal: "1.0",
        description: "Fund scholarships and build schools in underserved communities.",
    },
};

const charityDetails3 = {
    name: "Forest Conservation Initiative",
    description: "An organization dedicated to preserving forests and promoting sustainable land use practices.",
    milestone: {
        address: "0x5d658883faefbf67ff2a2c98efef920951200f57",
        goal: "2",
        description: "Support forest restoration projects and sustainable agriculture initiatives.",
    },
};


const Charities = () => {
    return (
        <div>
            <Milestone charityDetails={charityDetails1} />
            <Milestone charityDetails={charityDetails2} />
            {/* <Milestone charityDetails={charityDetails3} /> */}
        </div>
    )
};


export default Charities;
export { charityDetails1, charityDetails2, charityDetails3 };
