export default {
    summary: (firstName, hours, from, to) => `Almost there! So far, ${firstName} has entered ${hours} hours for the week of ${from} to ${to}.`,
    missingHours: (hours) => `${40 - hours} hours logged`,
    withAttachments: (from, to) => `*Hello!* These are the logged hours so far for the week of ${from} to ${to}. Please make sure they are up-to-date :robot_face:`,
    withoutAttachments: () => '*Nicely done, folks!* I’ve got no reminders for you, because *everyone has already entered their hours.* Keep it up!'
  };