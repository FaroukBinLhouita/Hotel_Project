import supabase, { supabaseUrl } from "./supabase";

export default async function getCabins() {
  const { data, error } = await supabase.from("cabin").select("*");

  if (error) {
    console.error("cabins can't loaded");
    throw new Error("cabins can't loaded");
  }

  return data;
}

export async function insertCabinRow(newCabin, id) {
  const hasImage = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImage
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/Cabin-images/${imageName}`;

  let query = supabase.from("cabin");

  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("cabin can't be created");
  }

  if (hasImage) return data;

  const { error: storageError } = await supabase.storage
    .from("Cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    await supabase.from("cabin").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error("image could'nt be upload");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabin").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("cabins can't del");
  }

  return data;
}
