import { assert, expect, test } from "vitest";
import fs from "fs";
import yaml from "js-yaml";
import ajv from "ajv";

const currentTourData = yaml.load(
  fs.readFileSync("data/currentTour.yaml", "utf8")
);

test("Validate cyclists schema", () => {
  const cyclistsSchema = yaml.load(
    fs.readFileSync("schemas/cyclists.json", "utf8")
  );

  const cyclistsJSON = yaml.load(
    fs.readFileSync(
      "data" + currentTourData.currentTourLocation + "/cyclists.yaml",
      "utf8"
    )
  );

  const ajvInstance = new ajv();
  const validate = ajvInstance.compile(cyclistsSchema);
  expect(validate(cyclistsJSON)).toBeTruthy();
});
