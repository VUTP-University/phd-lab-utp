import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

export default function ShareButtons({ url, title }) {
  return (
    <div className="flex gap-2 mt-3">
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={28} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={28} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={28} round />
      </LinkedinShareButton>
    </div>
  );
}
