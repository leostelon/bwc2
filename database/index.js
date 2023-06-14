const { Polybase } = require("@polybase/client");

export const db = new Polybase({
	defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
});
