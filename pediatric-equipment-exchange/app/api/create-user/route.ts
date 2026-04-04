import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! //server only
);

export async function POST(req: Request) {
  try {
    const { username, password, fullName, role } = await req.json();

    // Validate input
    if (!username || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();
    const email = `${cleanUsername}@paec.com`;

    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          username: cleanUsername,
          role: role || "volunteer",
          fullName,
        },
      });

    console.log("Auth createUser response:", authData, authError);

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message || "Auth error" }),
        { status: 400 }
      );
    }

    const userId = authData.user?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID not returned from Supabase" }),
        { status: 500 }
      );
    }

    // Insert into profiles table
    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: fullName,
          role: role || "volunteer",
          username: cleanUsername, // make sure this column exists
        })
        .select();

    console.log("Profiles insert response:", profileData, profileError);

    if (profileError) {
      return new Response(
        JSON.stringify({
          error: profileError.message || "Database error creating profile",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ authData, profileData }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
}