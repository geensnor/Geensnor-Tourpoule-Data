import { assert, expect, test } from "vitest";
import fs from "fs";
import yaml from "js-yaml";
import ajv from "ajv";

const currentTourFile = fs.readFileSync("data/currentTour.yaml", "utf8");
const currentTourData = yaml.load(currentTourFile);
const currentTourStagesLocation =
  "data" + currentTourData.currentTourLocation + "/stages/";

const files = fs
  .readdirSync(currentTourStagesLocation)
  .filter((element) => !element.startsWith(".")); //filter hidden files

const cyclistsJSON = yaml.load(
  fs.readFileSync(
    "data" + currentTourData.currentTourLocation + "/cyclists.yaml",
    "utf8"
  )
);

const cyclistArray = cyclistsJSON
  .map((obj) => obj.cyclists)
  .reduce((acc, arr) => acc.concat(arr), []);

test("Validate stage schema", () => {
  const stageSchema = yaml.load(fs.readFileSync("schemas/stage.json", "utf8"));

  const ajvInstance = new ajv();
  const validate = ajvInstance.compile(stageSchema);

  files.forEach((file) => {
    let stageData = fs.readFileSync(currentTourStagesLocation + file, "utf8");
    console.log(stageData);
    let stageDataJSON = yaml.load(stageData);
    expect(validate(stageDataJSON)).toBeTruthy();
  });
});

test("The stage results contain as many riders as points are given to riders in the tour config", () => {
  //Read tour config
  const currentTourConfigJSON = yaml.load(
    fs.readFileSync(
      "data" + currentTourData.currentTourLocation + "/tourConfig.yaml",
      "utf8"
    )
  );

  files.forEach((file) => {
    let stageDataJSON = yaml.load(
      fs.readFileSync(currentTourStagesLocation + file, "utf8")
    );

    if (stageDataJSON.status === "finished") {
      expect(stageDataJSON.stageResults.length).toEqual(
        currentTourConfigJSON.scoring.length
      );
    }
  });
});

test("Stagewinners are cyclists in the current tour", () => {
  files.forEach((file) => {
    let stageData = fs.readFileSync(currentTourStagesLocation + file, "utf8");

    let stageDataJSON = yaml.load(stageData);
    if (stageDataJSON.stageResults) {
      expect(cyclistArray).toEqual(
        expect.arrayContaining(stageDataJSON.stageResults)
      );
    }
  });
});
