"use server";

import prisma from "@/prisma/prisma";

export async function createOrUpdateUser(
  clerkUserId: string,
  email: string,
  name: string
) {
  try {
    console.log("Creating or updating user:", clerkUserId, email, name);
    const existingUser = await prisma.user.findUnique({
      where: {
        stripeCustomerId: clerkUserId,
      },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: {
          stripeCustomerId: clerkUserId,
        },
        data: {
          name,
          email,
        },
      });
      console.log("Updated user:", updatedUser);
      return updatedUser;
    }

    // Check if the user exists by email
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userWithEmail) {
      // Update user if email exists (link to stripeCustomerId)
      const updatedUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          name,
          stripeCustomerId: clerkUserId,
        },
      });
      console.log("Updated user:", updatedUser);
      return updatedUser;
    }

    // If no user exists, create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        clerkId: clerkUserId,
      },
    });
    console.log("New user created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return null;
  }
}
