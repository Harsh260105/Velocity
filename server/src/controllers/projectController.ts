import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;

  // Parse dates outside the try block so they're available in the catch block
  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  try {
    // Make sure we're not explicitly setting an ID and let Prisma handle it
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("Project creation error:", error);

    if (error.code === "P2002" && error.meta?.target?.includes("id")) {
      try {
        const newProject = await prisma.project.create({
          data: {
            name,
            description,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
          },
        });
        res.status(201).json(newProject);
        return;
      } catch (retryError: any) {
        console.error("Second attempt at project creation failed:", retryError);
        res.status(409).json({
          message:
            "A conflict occurred with the project ID. Please try again later.",
        });
        return;
      }
    }

    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};
