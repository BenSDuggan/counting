
import { readFileSync } from 'fs'

const SETTINGS_FILE_PATH = "../data/settings.json";

export const settings = JSON.parse(readFileSync(SETTINGS_FILE_PATH, 'utf8'));
