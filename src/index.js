const message = `Gone`;

export default {
  fetch(request) {
    return new Response(request.method === "HEAD" ? null : message, {
      status: 410,
      statusText: "Gone",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
