import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("No database seeding required for this application.");
    console.log("This application uses localStorage for data persistence.");
  } catch (error) {
    console.error(error);
  }
}

seed();
