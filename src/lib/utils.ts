import { roomsWithBookings, RoomTypesWithRoomsCount } from "@/types/relations";
import { clsx, type ClassValue } from "clsx";
import { randomFillSync } from "crypto";
import { addDays, isBefore } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const verifyTemplate = (name: string, link: string) =>
  `<!DOCTYPE html><html xmlns=http://www.w3.org/1999/xhtml xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml><head><!--[if gte mso 9]><xml><o:officedocumentsettings><o:allowpng><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml><![endif]--><meta content="text/html; charset=UTF-8" http-equiv=Content-Type /><meta content="width=device-width,initial-scale=1" name=viewport /><meta name=x-apple-disable-message-reformatting /><!--[if !mso]><!--><meta content="IE=edge" http-equiv=X-UA-Compatible /><!--<![endif]--><title></title><style>@media only screen and (min-width:620px){.u-row{width:600px!important}.u-row .u-col{vertical-align:top}.u-row .u-col-100{width:600px!important}}@media(max-width:620px){.u-row-container{max-width:100%!important;padding-left:0!important;padding-right:0!important}.u-row .u-col{min-width:320px!important;max-width:100%!important;display:block!important}.u-row{width:100%!important}.u-col{width:100%!important}.u-col>div{margin:0 auto}}body{margin:0;padding:0}table,td,tr{vertical-align:top;border-collapse:collapse}p{margin:0}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors="true"]{color:inherit!important;text-decoration:none!important}table,td{color:#000}#u_body a{color:#e42413;text-decoration:underline}@media(max-width:480px){#u_content_heading_1 .v-color{color:#7e0a00!important}#u_content_heading_1 .v-text-align{text-align:center!important}}</style><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel=stylesheet /><!--<![endif]--><body class="clean-body u_body" style=margin:0;padding:0;-webkit-text-size-adjust:100%;background-color:#f9f9f9;color:#000><!--[if IE]><div class=ie-container><![endif]--><!--[if mso]><div class=mso-container><![endif]--><table cellpadding=0 cellspacing=0 style="border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;min-width:320px;margin:0 auto;background-color:#f9f9f9;width:100%" id=u_body><tr style=vertical-align:top><td style=word-break:break-word;border-collapse:collapse!important;vertical-align:top><!--[if (mso)|(IE)]><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=background-color:#f9f9f9 align=center><![endif]--><div style=padding:0;background-color:transparent class=u-row-container><div style="margin:0 auto;min-width:320px;max-width:600px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#fff" class=u-row><div style=border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent><!--[if (mso)|(IE)]><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:0;background-color:transparent align=center><table cellpadding=0 cellspacing=0 border=0 style=width:600px><tr style=background-color:#fff><![endif]--><!--[if (mso)|(IE)]><td style="width:600px;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"align=center width=600 valign=top><![endif]--><div style=max-width:320px;min-width:600px;display:table-cell;vertical-align:top class="u-col u-col-100"><div style=height:100%;width:100%!important><!--[if (!mso)&(!IE)]><!--><div style="box-sizing:border-box;height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"><!--<![endif]--><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif id=u_content_heading_1><tr><td style=overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:Cabin,sans-serif align=left><!--[if mso]><table width=100%><tr><td><![endif]--><h1 class="v-text-align v-color" style=margin:0;color:#171717;line-height:140%;text-align:center;word-wrap:break-word;font-size:22px;font-weight:400><span><span><span><strong>Wikusama Hotel</strong></span></span></span></h1><!--[if mso]> <![endif]--></td></tr></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]> <![endif]--><!--[if (mso)|(IE)]> <![endif]--></div></div></div><div style=padding:0;background-color:transparent class=u-row-container><div style="margin:0 auto;min-width:320px;max-width:600px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#171717" class=u-row><div style=border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent><!--[if (mso)|(IE)]><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:0;background-color:transparent align=center><table cellpadding=0 cellspacing=0 border=0 style=width:600px><tr style=background-color:#171717><![endif]--><!--[if (mso)|(IE)]><td style="width:600px;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"align=center width=600 valign=top><![endif]--><div style=max-width:320px;min-width:600px;display:table-cell;vertical-align:top class="u-col u-col-100"><div style=height:100%;width:100%!important><!--[if (!mso)&(!IE)]><!--><div style="box-sizing:border-box;height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"><!--<![endif]--><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:Cabin,sans-serif" align=left><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding-right:0;padding-left:0 align=center class=v-text-align><img align=center alt=Image border=0 src=https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png style=outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:inline-block!important;border:none;height:auto;float:none;width:26%;max-width:150.8px title=Image width=150.8></td></tr></table></td></tr></table><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style=overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:Cabin,sans-serif align=left><div style=font-size:14px;color:#e5eaf5;line-height:140%;text-align:center;word-wrap:break-word class="v-text-align v-color"><p style=font-size:14px;line-height:140%></p></div></td></tr></table><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:0 10px 31px;font-family:Cabin,sans-serif" align=left><div style=font-size:14px;color:#e5eaf5;line-height:140%;text-align:center;word-wrap:break-word class="v-text-align v-color"><p style=font-size:14px;line-height:140%><span style=font-size:28px;line-height:39.2px><strong><span style=line-height:39.2px;font-size:28px>Verify Your Account!</span></strong></span></p></div></td></tr></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]> <![endif]--><!--[if (mso)|(IE)]> <![endif]--></div></div></div><div style=padding:0;background-color:transparent class=u-row-container><div style="margin:0 auto;min-width:320px;max-width:600px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#fff" class=u-row><div style=border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent><!--[if (mso)|(IE)]><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:0;background-color:transparent align=center><table cellpadding=0 cellspacing=0 border=0 style=width:600px><tr style=background-color:#fff><![endif]--><!--[if (mso)|(IE)]><td style="width:600px;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"align=center width=600 valign=top><![endif]--><div style=max-width:320px;min-width:600px;display:table-cell;vertical-align:top class="u-col u-col-100"><div style=height:100%;width:100%!important><!--[if (!mso)&(!IE)]><!--><div style="box-sizing:border-box;height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"><!--<![endif]--><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:Cabin,sans-serif" align=left><div style=font-size:14px;line-height:160%;text-align:center;word-wrap:break-word class="v-text-align v-color"><p style=font-size:14px;line-height:160%><span style=font-size:22px;line-height:35.2px>Hello there, ${name}</span></p><p style=font-size:14px;line-height:160%><span style=font-size:18px;line-height:28.8px>Please click the button below to verify your account's email</span></p></div></td></tr></table><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style=overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:Cabin,sans-serif align=left><!--[if mso]><style>.v-button{background:0 0!important}</style><![endif]--><div class=v-text-align align=center><!--[if mso]><v:roundrect xmlns:v=urn:schemas-microsoft-com:vml xmlns:w=urn:schemas-microsoft-com:office:word href=""style=height:46px;v-text-anchor:middle;width:168px arcsize=8.5% stroke=f fillcolor=#171717><w:anchorlock><center style=color:#fff><![endif]--><a class=v-button href=${link} style=box-sizing:border-box;display:inline-block;text-decoration:none;-webkit-text-size-adjust:none;text-align:center;color:#fff;background-color:#171717;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto;max-width:100%;overflow-wrap:break-word;word-break:break-word;word-wrap:break-word;mso-border-alt:none;font-size:14px target=_blank><span style="display:block;padding:14px 44px 13px;line-height:120%"><span style=font-size:16px;line-height:19.2px><strong><span style=line-height:19.2px;font-size:16px>VERIFY</span></strong></span></span></a><p style=line-height:160%;font-size:12px><span style=font-size:14px;line-height:28.8px>(this link will be expired in 24 hours)</span></p><!--[if mso]> <![endif]--></div></td></tr></table><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:Cabin,sans-serif" align=left><div style=font-size:14px;line-height:160%;text-align:center;word-wrap:break-word class="v-text-align v-color"><p style=line-height:160%;font-size:14px><span style=font-size:18px;line-height:28.8px>Thank you,</span></p><p style=line-height:160%;font-size:14px><span style=font-size:18px;line-height:28.8px></span></p><p style=line-height:160%;font-size:14px><span style=font-size:12px;line-height:19.2px>*Ignore this email if you've never register an account in Wikusama Hotel.</span></p></div></td></tr></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]> <![endif]--><!--[if (mso)|(IE)]> <![endif]--></div></div></div><div style=padding:0;background-color:transparent class=u-row-container><div style="margin:0 auto;min-width:320px;max-width:600px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#171717" class=u-row><div style=border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent><!--[if (mso)|(IE)]><table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td style=padding:0;background-color:transparent align=center><table cellpadding=0 cellspacing=0 border=0 style=width:600px><tr style=background-color:#171717><![endif]--><!--[if (mso)|(IE)]><td style="width:600px;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"align=center width=600 valign=top><![endif]--><div style=max-width:320px;min-width:600px;display:table-cell;vertical-align:top class="u-col u-col-100"><div style=height:100%;width:100%!important><!--[if (!mso)&(!IE)]><!--><div style="box-sizing:border-box;height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent"><!--<![endif]--><table cellpadding=0 cellspacing=0 border=0 width=100% role=presentation style=font-family:Cabin,sans-serif><tr><td style=overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:Cabin,sans-serif align=left><div style=font-size:14px;color:#fafafa;line-height:180%;text-align:center;word-wrap:break-word class="v-text-align v-color"><p style=font-size:14px;line-height:180%><span style=font-size:16px;line-height:28.8px>2024 © Digifest All Rights Reserved.</span></p></div></td></tr></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]> <![endif]--><!--[if (mso)|(IE)]> <![endif]--></div></div></div><!--[if (mso)|(IE)]> <![endif]--></td></tr></table><!--[if mso]> <![endif]--><!--[if IE]> <![endif]--></body></head>`;

export function generateRandomString(length: number): string {
  const buffer = Buffer.alloc(length);
  randomFillSync(buffer);

  return buffer.toString("base64").slice(0, length);
}

export function stringifyDate(date: Date, full?: boolean) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minute = ("0" + date.getMinutes()).slice(-2);

  return full
    ? `${year}/${month}/${day} at ${hour}:${minute}`
    : `${day} ${months[date.getMonth()]}, ${year}`;
}

export const MAX_FILE_SIZE = 5_000_000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export async function fileToBuffer(file: File) {
  const fileBuffer = await file.arrayBuffer();
  return Buffer.from(fileBuffer);
}

export function toIDR(amount: number) {
  return `Rp. ${amount.toLocaleString("id-ID", { currency: "IDR" })}`;
}

export function roomTypeIsAvailable(roomType: RoomTypesWithRoomsCount) {
  return (
    roomType.rooms.filter((room) =>
      room.bookings.find(
        (booking) => new Date().getTime() > booking.check_out_at.getTime(),
      ),
    ).length === 0
  );
}

export function getAllBookedDates(
  bookings: {
    check_in_at: Date;
    check_out_at: Date;
  }[],
) {
  const getDateRange = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = start;

    while (
      isBefore(currentDate, end) ||
      currentDate.getTime() === end.getTime()
    ) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  };

  let allBookedDates: Date[] = [];

  bookings.forEach((booking) => {
    const bookedDates = getDateRange(
      new Date(booking.check_in_at),
      new Date(booking.check_out_at),
    );
    allBookedDates = [...allBookedDates, ...bookedDates];
  });

  const uniqueBookedDates = Array.from(
    new Set(allBookedDates.map((date) => date)),
  );

  return uniqueBookedDates;
}

export function getAvailableRooms({
  bookings,
  rooms,
  start,
  end,
  typeId,
}: {
  bookings: { check_in_at: Date; check_out_at: Date; roomId: string }[];
  rooms: roomsWithBookings[];
  start: Date;
  end: Date;
  typeId: string;
}) {
  const bookedRoomsBookings = bookings.filter(
    (booking) => booking.check_in_at <= end && booking.check_out_at >= start,
  );
  const bookedRoomIds = bookedRoomsBookings.map((booking) => booking.roomId);

  const availableRooms = rooms.filter(
    (room) => !bookedRoomIds.includes(room.id) && room.room_typeId === typeId,
  );

  return availableRooms;
}
