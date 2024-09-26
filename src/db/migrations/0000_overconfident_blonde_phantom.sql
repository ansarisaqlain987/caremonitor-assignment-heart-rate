CREATE TABLE IF NOT EXISTS "measurement_types" (
	"tag" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"uom" varchar(20)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "measurements" (
	"patient_id" varchar,
	"measurement_tag" varchar,
	"measurement_value" numeric,
	"measured_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "measurements_patient_id_measurement_tag_measured_at_pk" PRIMARY KEY("patient_id","measurement_tag","measured_at")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"patient_id" varchar PRIMARY KEY NOT NULL,
	"org_id" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"from_healthkit_sync" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "measurements" ADD CONSTRAINT "measurements_patient_id_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "measurements" ADD CONSTRAINT "measurements_measurement_tag_measurement_types_tag_fk" FOREIGN KEY ("measurement_tag") REFERENCES "public"."measurement_types"("tag") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "measurement_types_name_unique" ON "measurement_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_measurements_measured_at" ON "measurements" USING btree ("measured_at");