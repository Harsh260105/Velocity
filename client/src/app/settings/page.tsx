"use client";

import Header from "@/components/Header";
import React from "react";
import { useGetAuthUserQuery, useGetTeamsQuery } from "@/state/api";

const Settings = () => {
  const { data: currentUser, isLoading: isLoadingUser } = useGetAuthUserQuery(
    {},
  );
  const { data: teams, isLoading: isLoadingTeams } = useGetTeamsQuery();

  // Find user's team if available
  const userTeam = teams?.find(
    (team) => team.teamId === currentUser?.userDetails?.teamId,
  );

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";
  return (
    <div className="p-8">
      <Header name="Settings" />
      {isLoadingUser || isLoadingTeams ? (
        <div className="py-4 text-center">Loading user settings...</div>
      ) : currentUser?.userDetails ? (
        <div className="space-y-4">
          <div>
            <label className={labelStyles}>Username</label>
            <div className={textStyles}>{currentUser.userDetails.username}</div>
          </div>
          <div>
            <label className={labelStyles}>Email</label>
            <div className={textStyles}>{currentUser.userDetails.email}</div>
          </div>
          <div>
            <label className={labelStyles}>Team</label>
            <div className={textStyles}>
              {userTeam ? userTeam.teamName : "No team assigned"}
            </div>
          </div>
          <div>
            <label className={labelStyles}>Role</label>
            <div className={textStyles}>
              {currentUser.userDetails.teamId ? "Team Member" : "User"}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-red-500">
          Could not load user information
        </div>
      )}
    </div>
  );
};

export default Settings;
