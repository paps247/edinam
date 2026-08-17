/* =========================================
   GHACEM PRODUCT INFORMATION PORTAL
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       LOADING SCREEN
       ========================================= */

    const loader = document.getElementById("loader");

    window.addEventListener("load", function () {

        setTimeout(function () {

            if (loader) {

                loader.style.opacity = "0";
                loader.style.visibility = "hidden";
                loader.style.transition = "opacity 0.5s ease";

            }

        }, 100);

    });


    /* =========================================
       SMOOTH NAVIGATION
       ========================================= */

    const navigationLinks = document.querySelectorAll('a[href^="#"]');

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const sectionId = this.getAttribute("href");

            if (sectionId === "#") {
                return;
            }

            const targetSection = document.querySelector(sectionId);

            if (targetSection) {

                event.preventDefault();

                targetSection.scrollIntoView({

                    behavior: "smooth",
                    block: "start"

                });

            }

        });

    });


    /* =========================================
       WELCOME BUTTON
       ========================================= */

    const exploreButton = document.querySelector(".welcome-card button");

    if (exploreButton) {

        exploreButton.addEventListener("click", function () {

            const productSection = document.getElementById("product");

            if (productSection) {

                productSection.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    }


    /* =========================================
       CUSTOM MIX DISPLAY
       ========================================= */

    const mixType = document.getElementById("mixType");
    const customMix = document.getElementById("customMix");

    if (mixType && customMix) {

        mixType.addEventListener("change", function () {

            if (this.value === "custom") {

                customMix.style.display = "block";

            } else {

                customMix.style.display = "none";

            }

        });

    }


    /* =========================================
       FLOATING HELP BUTTON
       ========================================= */

    const helpButton = document.querySelector(".help-button");

    if (helpButton) {

        helpButton.addEventListener("click", function () {

            const contactSection = document.getElementById("contact");

            if (contactSection) {

                contactSection.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    }

});

/* =========================================
   MATERIAL ESTIMATOR
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const calculateButton =
    document.getElementById("calculateButton");

    const lengthInput = document.getElementById("length");
    const widthInput = document.getElementById("width");
    const thicknessInput = document.getElementById("thickness");
    const mixTypeInput = document.getElementById("mixType");

    if (!calculateButton) {
        return;
    }

    calculateButton.addEventListener("click", function (event) {

        event.preventDefault();

        /* =========================================
           READ USER INPUTS
           ========================================= */

        const length = Number(lengthInput?.value);
        const width = Number(widthInput?.value);
        const thicknessMillimetres = Number(thicknessInput?.value);

        if (
            !length ||
            !width ||
            !thicknessMillimetres ||
            length <= 0 ||
            width <= 0 ||
            thicknessMillimetres <= 0
        ) {

            alert(
                "Please enter valid values for length, width and thickness."
            );

            return;

        }

        /* Convert thickness from millimetres to metres */

        const thicknessMetres = thicknessMillimetres / 1000;

        /* Calculate wet concrete volume */

        const wetVolume =
            length *
            width *
            thicknessMetres;

        /*
           Dry-volume factor accounts for:
           - spaces between materials
           - shrinkage
           - handling losses
        */

        const dryVolumeFactor = 1.54;

        const dryVolume = wetVolume * dryVolumeFactor;


        /* =========================================
           DETERMINE MIX RATIO
           ========================================= */

        let cementRatio = 1;
        let sandRatio = 2;
        let aggregateRatio = 4;

        const selectedMix = mixTypeInput?.value || "1:2:4";

        if (selectedMix === "custom") {

            const customCement =
                Number(
                    document.getElementById("cementRatio")?.value
                );

            const customSand =
                Number(
                    document.getElementById("sandRatio")?.value
                );

            const customAggregate =
                Number(
                    document.getElementById("aggregateRatio")?.value
                );

            if (
                !customCement ||
                !customSand ||
                !customAggregate ||
                customCement <= 0 ||
                customSand <= 0 ||
                customAggregate <= 0
            ) {

                alert(
                    "Please enter valid values for the custom mix ratio."
                );

                return;

            }

            cementRatio = customCement;
            sandRatio = customSand;
            aggregateRatio = customAggregate;

        } else {

            /*
               This reads values such as:
               1:2:4
               1:1.5:3
               1:3:6
            */

            const ratioParts = selectedMix
                .split(":")
                .map(Number);

            if (
                ratioParts.length === 3 &&
                ratioParts.every(function (value) {
                    return value > 0;
                })
            ) {

                cementRatio = ratioParts[0];
                sandRatio = ratioParts[1];
                aggregateRatio = ratioParts[2];

            }

        }


        /* =========================================
           CALCULATE MATERIAL VOLUMES
           ========================================= */

        const totalRatio =
            cementRatio +
            sandRatio +
            aggregateRatio;

        const cementVolume =
            dryVolume *
            (cementRatio / totalRatio);

        const sandVolume =
            dryVolume *
            (sandRatio / totalRatio);

        const aggregateVolume =
            dryVolume *
            (aggregateRatio / totalRatio);


        /* =========================================
           CALCULATE CEMENT BAGS
           ========================================= */

        /*
           Approximate bulk density of cement:
           1440 kg per cubic metre

           Standard Ghacem cement bag:
           50 kg
        */

        const cementDensity = 1440;
        const cementBagWeight = 50;

        const cementWeight =
            cementVolume *
            cementDensity;

        const exactCementBags =
            cementWeight /
            cementBagWeight;

        /*
           Bags are rounded upward because users
           cannot normally purchase part of a bag.
        */

        const cementBags =
            Math.ceil(exactCementBags);


        /* =========================================
           ALLOWANCE FOR MATERIAL WASTE
           ========================================= */

        const wasteAllowance = 1.05;

        const finalSandVolume =
            sandVolume *
            wasteAllowance;

        const finalAggregateVolume =
            aggregateVolume *
            wasteAllowance;


        /* =========================================
           DISPLAY THE RESULTS
           ========================================= */

        updateResult(
            ["volumeResult", "concreteVolume"],
            wetVolume.toFixed(2) + " m³"
        );

        updateResult(
            ["cementResult", "cementBags"],
            cementBags + " bags"
        );

        updateResult(
            ["sandResult", "sandAmount"],
            finalSandVolume.toFixed(2) + " m³"
        );

        updateResult(
            ["aggregateResult", "aggregateAmount"],
            finalAggregateVolume.toFixed(2) + " m³"
        );

        updateResult(
            ["mixResult", "selectedMixResult"],
            cementRatio +
            ":" +
            sandRatio +
            ":" +
            aggregateRatio
        );


        /* =========================================
           REVEAL RESULTS SECTION
           ========================================= */

        const resultsSection =
            document.getElementById("results") ||
            document.querySelector(".results");

        if (resultsSection) {

            resultsSection.style.display = "block";

            resultsSection.scrollIntoView({

                behavior: "smooth",
                block: "center"

            });

        }

    });


    /* =========================================
       RESULT UPDATE FUNCTION
       ========================================= */

    function updateResult(possibleIds, resultValue) {

        for (let i = 0; i < possibleIds.length; i++) {

            const resultElement =
                document.getElementById(possibleIds[i]);

            if (resultElement) {

                resultElement.textContent = resultValue;

                return;

            }

        }

    }

});

/* =====================================
   DARK MODE
===================================== */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    const icon = themeToggle.querySelector("i");

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    }

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");

            localStorage.setItem("theme", "dark");

        } else {

            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");

            localStorage.setItem("theme", "light");

        }

    });

}

/* ======================================
   GHACEM SMART ESTIMATOR
   PART 1: PROJECT SELECTION
====================================== */

const projectCards = document.querySelectorAll(".project-card");

const projectSelection = document.getElementById("projectSelection");
const projectDetails = document.getElementById("projectDetails");
const resultsSection = document.getElementById("results");

const selectedProjectTitle = document.getElementById(
    "selectedProjectTitle"
);



const dimensionOne = document.getElementById("dimensionOne");
const dimensionTwo = document.getElementById("dimensionTwo");
const dimensionThree = document.getElementById("dimensionThree");

const recommendedMixText = document.getElementById(
    "recommendedMixText"
);
const recommendedMixDescription = document.getElementById(
    "recommendedMixDescription"
);

const aggregateRatioBox = document.getElementById(
    "aggregateRatioBox"
);

const changeProjectButton = document.getElementById(
    "changeProjectButton"
);

const estimatorSteps = document.querySelectorAll(
    ".calculator-steps .step"
);

let selectedProject = "";


/* PROJECT INFORMATION */

const projectSettings = {

    highStrengthConcrete: {
        title: "Foundation",
        labels: [
            "Length (m)",
            "Width (m)",
            "Depth (m)"
        ],
        placeholders: [
            "Example: 10",
            "Example: 0.6",
            "Example: 0.25"
        ],
        ratio: "1 : 3 : 5",
        description: "Cement : Sand : Aggregate",
        type: "concrete"
    },

    slab: {
        title: "Concrete Slab",
        labels: [
            "Length (m)",
            "Width (m)",
            "Thickness (m)"
        ],
        placeholders: [
            "Example: 6",
            "Example: 5",
            "Example: 0.15"
        ],
        ratio: "1 : 2 : 4",
        description: "Cement : Sand : Aggregate",
        type: "concrete"
    },

    column: {
        title: "Column",
        labels: [
            "Height (m)",
            "Length (m)",
            "Width (m)"
        ],
        placeholders: [
            "Example: 3",
            "Example: 0.3",
            "Example: 0.3"
        ],
        ratio: "1 : 1.5 : 3",
        description: "Cement : Sand : Aggregate",
        type: "concrete"
    },

    beam: {
        title: "Beam",
        labels: [
            "Length (m)",
            "Width (m)",
            "Depth (m)"
        ],
        placeholders: [
            "Example: 5",
            "Example: 0.25",
            "Example: 0.4"
        ],
        ratio: "1 : 1.5 : 3",
        description: "Cement : Sand : Aggregate",
        type: "concrete"
    },

    standardStrengthConcrete: {
        title: "Block Laying",
        labels: [
            "Wall Length (m)",
            "Wall Height (m)",
            "Wall Thickness (m)"
        ],
        placeholders: [
            "Example: 12",
            "Example: 3",
            "Example: 0.15"
        ],
        ratio: "1 : 3 : 6",
        description: "Cement : Sand : Aggregate",
        type: "mortar"
    },

    blockManufacturing: { // This key is now used by the first button
        title: "Block Manufacturing",
        ratio: "1 : 10",
        description: "Cement : Sand",
        type: "manufacturing"
    },

    lowStrengthConcrete: {
        title: "Plastering",
        labels: [
            "Wall Length (m)",
            "Wall Height (m)",
            "Plaster Thickness (m)"
        ],
        placeholders: [
            "Example: 10",
            "Example: 3",
            "Example: 0.015"
        ],
        ratio: "1 : 4 : 8",
        description: "Cement : Sand : Aggregate",
        type: "mortar"
    }

};


/* UPDATE STEP INDICATOR */

function activateEstimatorStep(stepNumber) {

    estimatorSteps.forEach((step, index) => {

        if (index < stepNumber) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }

    });

}


/* RESET INPUT VALUES */

function clearEstimatorInputs() {

    const numberOfBatches = document.getElementById("numberOfBatches");
    if (numberOfBatches) {
        numberOfBatches.value = "";
    }

}


/* UNIT SELECTOR LOGIC */

const unitButtons = document.querySelectorAll(".unit-button");
let selectedUnit = "wheelbarrow"; // Default unit

if (unitButtons) {
    unitButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active class from all buttons
            unitButtons.forEach(btn => btn.classList.remove("active"));

            // Add active class to the clicked button
            this.classList.add("active");

            // Update the selected unit
            selectedUnit = this.dataset.unit;
            console.log("Selected unit:", selectedUnit);
        });
    });

}


/* DISPLAY SELECTED PROJECT */

function showSelectedProject(projectName) {

    selectedProject = projectName;

    const settings = projectSettings[projectName];

    if (!settings) {
        return;
    }

    clearEstimatorInputs();

    const button = document.querySelector(`.project-card[data-project="${projectName}"]`);
    const buttonText = button ? button.querySelector("span").textContent : settings.title;
    selectedProjectTitle.textContent = buttonText;

    recommendedMixText.textContent = settings.ratio;

    recommendedMixDescription.textContent =
        settings.description;

    projectSelection.style.display = "none";
    projectDetails.style.display = "block";
    resultsSection.style.display = "none";

    projectCards.forEach(card => {

        card.classList.remove("active");

        if (card.dataset.project === projectName) {
            card.classList.add("active");
        }

    });



    activateEstimatorStep(2);

}


/* PROJECT CARD EVENTS */

projectCards.forEach(card => {

    card.addEventListener("click", function () {

        const projectName = this.dataset.project;

        showSelectedProject(projectName);

    });

});


/* CHANGE PROJECT BUTTON */

changeProjectButton.addEventListener("click", function () {

    projectDetails.style.display = "none";
    resultsSection.style.display = "none";
    projectSelection.style.display = "block";

    projectCards.forEach(card => {
        card.classList.remove("active");
    });

    selectedProject = "";

    activateEstimatorStep(1);

});

/* ======================================
   GHACEM SMART ESTIMATOR
   MIX-RATIO CONTROLS
====================================== */

const smartCalculateButton =
    document.getElementById("smartCalculateButton");

/* ======================================
   SMART ESTIMATOR CALCULATION
   PART 1 – READ USER INPUTS
====================================== */

if (smartCalculateButton) {
    smartCalculateButton.addEventListener("click", calculateMaterials);
}

function calculateMaterials() {
      

        if (!selectedProject) {

            alert("Please choose a construction activity.");

            return;

        }

        let numberOfBatches =
            Number(document.getElementById("numberOfBatches")?.value);

        console.log("Selected Project:", selectedProject);
        console.log("Batches:", numberOfBatches);

        /* ======================================
   CALCULATE MAIN PROJECT MEASUREMENT
====================================== */

let mainMeasurement = 0;
let measurementLabel = "";
if (!numberOfBatches || numberOfBatches <= 0) {
    alert("Please enter a valid number of batches.");
    return;
}

mainMeasurement = numberOfBatches;
measurementLabel = "Number of Batches";



/* ======================================
   DETERMINE MIX RATIO
====================================== */

let cementRatio = 1;
let sandRatio = 2;
let aggregateRatio = 4;

const projectType =
    projectSettings[selectedProject].type;

const recommendedRatio =
    projectSettings[selectedProject].ratio
        .replaceAll(" ", "")
        .split(":")
        .map(Number);

cementRatio = recommendedRatio[0];
sandRatio = recommendedRatio[1];

if (recommendedRatio.length === 3) {
    aggregateRatio = recommendedRatio[2];
} else {
    aggregateRatio = 0;
}


/* TEMPORARY TEST */

let mixRatioText =
    cementRatio + " : " + sandRatio;

if (aggregateRatio > 0) {
    mixRatioText += " : " + aggregateRatio;
}

/* ======================================
   CALCULATE MATERIAL QUANTITIES
====================================== */

let cementBags = 0;
let sandVolume = 0;
let aggregateVolume = 0;
let estimatedBlocks = 0;

const cementDensity = 1440;
const cementBagWeight = 50;

// The number of batches is the number of cement bags.
cementBags = mainMeasurement;

// Determine the volumetric equivalent of cement based on the selected unit.
let cementVolumeInUnit = 0;
if (selectedUnit === "wheelbarrow") {
    // 2 bags = 1 wheelbarrow
    cementVolumeInUnit = cementBags / 2;
} else { // headpan
    // 1 bag = 2 headpans
    cementVolumeInUnit = cementBags * 2;
}

// Calculate sand and aggregate based on the volumetric ratio.
const sandInUnit = cementVolumeInUnit * (sandRatio / cementRatio);
let aggregateInUnit = 0;

if (aggregateRatio > 0) {
    aggregateInUnit = cementVolumeInUnit * (aggregateRatio / cementRatio);
}

estimatedBlocks = 0; // Block estimation is removed


/* ======================================
   DISPLAY RESULTS ON THE PAGE
====================================== */

const cementResult = document.getElementById("cementResult");
const cementEquivalentResult = document.getElementById("cementEquivalentResult");

cementResult.textContent = cementBags + " bags";
cementEquivalentResult.textContent = `(Equivalent to ${Math.round(cementVolumeInUnit)} ${selectedUnit}s)`;

document.getElementById("sandResult").textContent =
    Math.ceil(sandInUnit) + ` ${selectedUnit}(s)`;

document.getElementById("aggregateResult").textContent =
    Math.ceil(aggregateInUnit) + ` ${selectedUnit}(s)`;


document.getElementById("blocksResult").textContent =
    estimatedBlocks;

document.getElementById("activityResult").textContent =
    projectSettings[selectedProject].title;

document.getElementById("mainMeasurementLabel").textContent =
    measurementLabel;

let measurementUnit = "";

if (projectType === "concrete") {
    measurementUnit = " bags";
}
document.getElementById("volumeResult").textContent = mainMeasurement + measurementUnit;

document.getElementById("mixResult").textContent =
    mixRatioText;


/* SHOW OR HIDE AGGREGATE CARD */

const aggregateResultCard =
    document.getElementById("aggregateResultCard");

if (aggregateInUnit > 0) {
    aggregateResultCard.style.display = "block";
} else {
    aggregateResultCard.style.display = "none";
}


/* SHOW OR HIDE BLOCKS CARD */

const blocksResultCard =
    document.getElementById("blocksResultCard");

if (estimatedBlocks > 0) {
    blocksResultCard.style.display = "block";
} else {
    blocksResultCard.style.display = "none";
}


/* SHOW RESULTS SECTION */

projectDetails.style.display = "none";
resultsSection.style.display = "block";

activateEstimatorStep(3);

resultsSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

};

/* ======================================
   RESULTS BUTTONS
====================================== */

const explanationButton =
    document.getElementById("explanationButton");

const calculationExplanation =
    document.getElementById("calculationExplanation");

const calculationExplanationText =
    document.getElementById("calculationExplanationText");

const startAgainButton =
    document.getElementById("startAgainButton");

const recalculateButton =
    document.getElementById("recalculateButton");


if (explanationButton) {

    explanationButton.addEventListener("click", function () {

        const isHidden =
            calculationExplanation.style.display === "none";

        if (isHidden) {

            calculationExplanation.style.display = "block";

            calculationExplanationText.textContent =
                "Material quantities are calculated using the recommended volumetric mix proportions in the Ghacem Product Handbook, " +
                "based on the following conversions: 2 cement bags = 1 wheelbarrow and 1 cement bag = 2 headpans";

            explanationButton.textContent =
                "Hide calculation details";

        } else {

            calculationExplanation.style.display = "none";

            explanationButton.textContent =
                "How did we calculate this?";

        }

    });

}


if (startAgainButton) {

    startAgainButton.addEventListener("click", function () {

        selectedProject = "";

        clearEstimatorInputs();

        resultsSection.style.display = "none";
        projectDetails.style.display = "none";
        projectSelection.style.display = "block";

        projectCards.forEach(function (card) {
            card.classList.remove("active");
        });

        if (calculationExplanation) {
            calculationExplanation.style.display = "none";
        }

        if (explanationButton) {
            explanationButton.textContent =
                "How did we calculate this?";
        }

        activateEstimatorStep(1);

        projectSelection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


if (recalculateButton) {

    recalculateButton.addEventListener("click", function () {

        resultsSection.style.display = "none";
        projectDetails.style.display = "block";

        activateEstimatorStep(2);

        projectDetails.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}
