import React, { useState } from 'react';
import DefaultStepper from '../../components/Stepper/DefaultStepper';
import { useLocation } from 'react-router-dom';
import { CreateQuote } from 'styles/pages/CreateQuote/index';





import useMetaData from "context/metaData";
import DynamicForm from './HeraldTab';
import QuotePage from './QuotePage';
const HeraldForm = () => {
    const {theme} = useMetaData();
    const { state } = useLocation();
    const steps = ['Application', 'Submit Application', 'Quote', ];
    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = useState(false);
    
   
    const [nextVal, setNextVal] = useState(false);
  
 
  
    const handleNextStep = () => {
        setActiveStep(prevStep => prevStep + 1);
    };
    const handlePrevStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setNextVal(prev => !prev);
    };


    // const handleVehicleAddition = (values) => {
    //     setVehicleData(prevData => {
    //         var newData = [...prevData, values.additionalvehicle]
    //         return newData
    //     })

    // }

    // const handleVehicleRemoval = (values) => {
    //     setVehicleData(prevData => {
    //         var newData = prevData.filter((item) => {
    //             return item.vin != values.vin
    //         })
    //         return newData
    //     })
    // }

    // const handleVehicleCheckBoxChange = () => {
    //     setVehicleCheckBox(prev => !prev)
    // }

    // const handleDriverAddition = (values) => {
    //     setDriverData(prevData => {
    //         var newData = [...prevData, values.drivers]
    //         return newData
    //     })

    // }

    // const handleDriverRemoval = (values) => {
    //     setDriverData(prevData => {
    //         var newData = prevData.filter((driver) => {
    //             return driver.firstname != values.firstname
    //         })
    //         return newData
    //     })
    // }

    // const handleDriverCheckBoxChange = () => {
    //     setDriverCheckBox(prev => !prev)
    // }

    const handleNextVal = () => {
        setNextVal(prev => !prev);
    }
    // const handleDataloss =(values) =>{
    //     setLossData(prevData => {
    //         var newData = [...prevData, values.losshistoryInfo]
    //         return newData
    //     })
    // }
    // const handleDataAddition = (values) => {
    //     setData(prevData => {
    //         var newData = [...prevData, values.additionalInfo ]
    //         return newData
    //     })
    // }
    

    // Conditionally render forms based on activeStep
    const renderFormContent = () => {
        switch (steps[activeStep]) {
            case 'Application':
                return<DynamicForm state={state} open={open} setOpen={setOpen} theme={theme}/>;
                
            case 'Submit Application':
                return<QuotePage state={state} open={open} setOpen={setOpen} theme={theme}/>;
            // case 'Get a Quote':
            //     return <Driver handleDriverRemoval={handleDriverRemoval} theme={theme} handleDriverAddition={handleDriverAddition} driverCheckBox={driverCheckBox} handleDriverCheckBoxChange={handleDriverCheckBoxChange} driverData={driverData} state={state} TabName="Comproperty" />;
            // // case 'Coverages':
            //     return <Coverages state={state} open={open} setOpen={setOpen} theme={theme} viewPolicy={viewPolicy} setViewPolicy={setViewPolicy} TabName="Comproperty" />
            // case 'Premium':
            //     return <Premium state={state} open={open} setOpen={setOpen} theme={theme} TabName="Comproperty" />;
            // case 'Questionnaire':
            //     return <Questionaire state={state} open={open} setOpen={setOpen} theme={theme} driverData={driverData} TabName="Comproperty" />;
            // case 'Loss History':
            //     return <Losshistory state={state} data={lossData} driverData={driverData} theme={theme} TabName="Comproperty" />

            // case 'Additional Interests':
            //     return <BindAdditionalInfo data={data} state={state} vehicleData={vehicleData} theme={theme} TabName="Comproperty" />
            // case 'Forms':
            //     return <BindForms theme={theme} state={state} TabName="Comproperty" />
            // case 'Payment':
            //     return <PaymentOptions state={state} open={open} setOpen={setOpen} theme={theme} viewPolicy={viewPolicy} setViewPolicy={setViewPolicy} TabName="Comproperty" />

            default:
                return null;
        }
    };

    return (
        <CreateQuote theme={theme} >
            <DefaultStepper
            theme={theme}
                state={state}
                //steps={steps}
                steps={activeStep < 5 ? steps.slice(0, 5) : steps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                handleNextStep={handleNextStep}
                handlePrevStep={handlePrevStep}
                handleNextVal={handleNextVal}
                // handleDataloss={handleDataloss}
                // handleDataAddition={handleDataAddition}
                nextVal={nextVal}
                // TabName="Comproperty"
                setOpen={setOpen}
                // setViewPolicy={setViewPolicy}
            >
                {/* Pass the form content as children */}
                {renderFormContent()}
            </DefaultStepper>
        </CreateQuote>
    );
};

export default HeraldForm;
