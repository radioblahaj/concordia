export async function getAllMessages(user) {
    const formData = new FormData();
    formData.append("token", process.env.SLACK_XOXC);
    formData.append("module", "messages");
    formData.append("query", `from:<@${user}>`);
    formData.append("page", 100000);

    const response = await fetch(
        `https://hackclub.slack.com/api/search.modules.messages`,
        {
            headers: {
                accept: "*/*",
                cookie: `d=${process.env.SLACK_XOXD}`,
            },
            body: formData,
            method: "POST",
        }
    );

    const data = await response.json();
    const messageCount = data.pagination;
    const achivementMet = false;
    console.log(messageCount);
    if (messageCount >= 200) {
        achivementMet = true;
    }
    // console.log(messageCount)
    return messageCount
}
