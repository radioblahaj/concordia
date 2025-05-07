import dotenv from 'dotenv';


export async function getAllMessages(user) {
  const formData = new FormData()
  dotenv.config();
  formData.append('token', process.env.SLACK_XOXC)
  formData.append('module', 'messages')
  formData.append('query', `from:<@${user}>`)
  formData.append('page', '100000')
try {
  const response = await fetch(
    'https://hackclub.slack.com/api/search.modules.messages',
    {
      method: 'POST',
      headers: {
        accept: '*/*',
        cookie: `d=${encodeURIComponent(process.env.SLACK_XOXD)}`,
      },
      body: formData,
    }
  )
    
  const data = await response.json()

  const messageCount = data.pagination?.total_count
  let achievementMet = false
  if (messageCount >= 200) {
    achievementMet = true
  }
//   console.log(messageCount)
//   console.log(`Found ${messageCount} messages (achievement: ${achievementMet})`)
  return messageCount
} catch(e) {
    throw new Error(`Error ${e}`)
}
}