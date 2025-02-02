import * as _ from "lodash";
import * as moment from "moment";
import { AttachmentTransformer } from "./attachment.transformer";
import { HarvestClient } from "./harvest.client";
import { SlackClient } from "./slack.client";
import strings from "./strings.helper";

export class HarveyHandler {
  constructor(
    private readonly harvest: HarvestClient,
    private readonly slack: SlackClient
  ) {}

  public handle = async () => {
    // Determine start and end dates
    const from = moment().subtract(6, "days").format("YYYY-MM-DD");
    const to = moment().format("YYYY-MM-DD");

    // Fetch time entries and users from Harvest
    const users = await Promise.resolve(this.harvest.getUsers()).catch((e) => {
      console.log(e);
    });

    const timeEntries = await Promise.resolve(
      this.harvest.getTimeEntries({ from, to })
    ).catch((e) => {
      console.log(e);
    });

    // Create Slack attachments
    const attachments = this.createAttachments(users, timeEntries).filter(
      (a) => a.missing > 0
    );

    // Set plain text fallback message
    const text =
      attachments.length > 0
        ? strings.withAttachments(from, to)
        : strings.withoutAttachments();

    // Post message to Slack
    await this.slack.postMessage({ text, attachments }).catch((e) => {
      console.log(e);
    });
  };

  createAttachments(users, timeEntries) {
    return users
      .filter((u) => u.is_active)
      .map((u) => {
        return AttachmentTransformer.transform(
          u,
          timeEntries.filter((t) => u.id === t.user.id)
        );
      });
  }
}
