test_that("downloads and saves the file appropriately", {
  meta <- download_dataverse_info("doi:10.18130/V3/SWK71R")
  expect_true(meta$id == 55114)
  expect_identical(read_json(paste0(tempdir(), "/1018130V3SWK71R.json")), meta)
})
