import express from "express";
import {
  readdirSync,
  statSync,
  readFileSync
} from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { requireLogin } from "../middleware/requireLogin.js";
import { addEndingToPlayer } from "../services/playerService.js";

const router = express.Router();

const currentDirectory = path.dirname(
  fileURLToPath(import.meta.url)
);

const viewsDirectory = path.resolve(
  currentDirectory,
  "../views"
);

const storyDirectory = path.join(
  viewsDirectory,
  "partials"
);

function findEjsFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);

    if (statSync(fullPath).isDirectory()) {
      files.push(...findEjsFiles(fullPath));
    } else if (entry.endsWith(".ejs")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getEndingContent(filePath, endingId) {
  const contents = readFileSync(filePath, "utf8");

  const titleMatch =
    contents.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i) ||
    contents.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const spanMatch =
    contents.match(/<span[^>]*>([\s\S]*?)<\/span>/i);

  const paragraphMatches = [
    ...contents.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)
  ];

  let title = titleMatch?.[1]?.trim();

  let description =
    spanMatch?.[1]?.trim() ||
    paragraphMatches
      .map(match => match[1].trim())
      .find(text =>
        text &&
        text.toLowerCase() !== "ending reached"
      );

  const hasPlaceholderTitle =
    !title ||
    title.toLowerCase() === "descriptor";

  const hasPlaceholderDescription =
    !description ||
    description.toLowerCase().includes("lorem");

  if (hasPlaceholderTitle) {
    title = `Ending ${endingId}`;
  }

  if (hasPlaceholderDescription) {
    description =
      "You reached one of the possible outcomes in the simulation!";
  }

  return {
    title,
    description
  };
}

const registeredRoutes = new Set();

for (const filePath of findEjsFiles(storyDirectory)) {
  const filename = path.basename(filePath, ".ejs");

  if (
  filename === "playerProgressMap" ||
  filename === "backButton"
  ) {
  continue;
  }

  const routePath =
    filename === "attendents"
      ? "/attendants"
      : `/${filename}`;

  if (registeredRoutes.has(routePath)) {
    throw new Error(
      `Duplicate story route detected: ${routePath}`
    );
  }

  registeredRoutes.add(routePath);

  const viewName = path
    .relative(viewsDirectory, filePath)
    .replaceAll(path.sep, "/")
    .replace(/\.ejs$/, "");

  const isEnding =
    /^[1-4]-[1-4]-[1-4]-[1-4]$/.test(filename);

  router.get(
    routePath,
    requireLogin,
    async (req, res) => {
    if (isEnding) {
      if (!req.session.playerId) {
        return res.redirect("/");
      }

      try {
        await addEndingToPlayer(
          req.session.playerId,
          filename,
          req.session.user
        );

        const ending = getEndingContent(
          filePath,
          filename
        );

        return res.render("ending", {
          endingId: filename,
          title: ending.title,
          description: ending.description
        });
      } catch (error) {
        return res
          .status(error.status ?? 400)
          .send(`<p>${error.message}</p>`);
      }
    }

    return res.render(viewName,   {
        showBackButton: true})
  }
);
}

export default router;