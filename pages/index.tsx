import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>CrossAI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
      }}>
        <h1>CrossAI</h1>
        <p>Click the green mic to chat. Audio generated via TTS.</p>
        <p><a href="/voice.html" style={{color:'#0070f3'}}>Manual voice test page</a></p>
      </main>
    </>
  );
}
