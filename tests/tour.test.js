import { expect, test } from "vitest";
import fs from "fs";
import yaml from "js-yaml";
import ajv from "ajv";
import ajvFormats from "ajv-formats";

const currentTourData = yaml.load(
  fs.readFileSync("data/currentTour.yaml", "utf8")
);

test("Validate tour schema", () => {
  const tourSchema = yaml.load(fs.readFileSync("schemas/tour.json", "utf8"));

  const ajvInstance = new ajv();
  ajvFormats(ajvInstance);
  const validate = ajvInstance.compile(tourSchema);

  let tourData = fs.readFileSync(
    "data" + currentTourData.currentTourLocation + "/tourConfig.yaml",
    "utf8"
  );
  let tourDataJSON = yaml.load(tourData);
  expect(validate(tourDataJSON)).toBeTruthy();
});

// Current tour location is not empty
test("currentTour not null", () => {
  expect(currentTourData.currentTourLocation).toBeTruthy();
});

//There are stages in the current tour location
test("Stages present in current tour", () => {
  const currentTourStagesLocation =
    "data" + currentTourData.currentTourLocation + "/stages/";

  const files = fs
    .readdirSync(currentTourStagesLocation)
    .filter((element) => !element.startsWith(".")); //filter hidden files
  expect(files).not.toHaveLength(0);
});

test("Cyclists in the final standing are cyclists in the current tour", () => {
  const cyclistsJSON = yaml.load(
    fs.readFileSync(
      "data" + currentTourData.currentTourLocation + "/cyclists.yaml",
      "utf8"
    )
  );

  //Flatten cyclists
  const cyclistArray = cyclistsJSON
    .map((obj) => obj.cyclists)
    .reduce((acc, arr) => acc.concat(arr), []);

  if (
    fs.existsSync(
      "data" + currentTourData.currentTourLocation + "/finalStanding.yaml"
    )
  ) {
    let finalStandingDataJSON = yaml.load(
      fs.readFileSync(
        "data" + currentTourData.currentTourLocation + "/finalStanding.yaml",
        "utf8"
      )
    );
    if (finalStandingDataJSON) {
      finalStandingDataJSON.finalStanding.forEach((value) => {
        expect(cyclistArray).toContain(value);
      });
    }
  }
});
