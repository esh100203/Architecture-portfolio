export function buildThirdPlacePortal() {
  return `
    <div class="pp_header">
      <span class="pp_header_title">The Third Place — Extension of the Streets</span>
      <button class="pp_back_btn">✕ Close</button>
    </div>
    <div class="pp_scroll">

      <!-- Viewport 1: Hero + Bazaar Character -->
      <div class="tp_first_vp">

      <!-- Section 1: Hero -->
      <section class="tp_hero">
        <div class="tp_left_col">
          <div class="tp_top_block">
            <div class="tp_number">02</div>
            <div class="tp_meta">
              <div class="tp_meta_row">
                <span class="tp_meta_label">Site Location</span>
                <span class="tp_meta_value">Bijapur, Karnataka</span>
              </div>
              <div class="tp_meta_row">
                <span class="tp_meta_label">Total Built Up</span>
                <span class="tp_meta_value">4300 sqm</span>
              </div>
            </div>
          </div>
          <div class="tp_desc_bottom">
            Sidewalks in Bijapur are more than just transit zones, they are vibrant, lived-in spaces where commerce, community, and everyday life unfold in layers. Embracing this character by merging it with the urban fabric.
          </div>
        </div>
        <div class="tp_right_col">
          <img loading="lazy" src="assets/projects/thirdplace/thumbnail.png" alt="The Third Place" class="tp_hero_img" />
        </div>
      </section>

      <!-- Section 2: Bazaar Character -->
      <div class="tp_bazaar_section">
        <h3 class="tp_bazaar_heading">Bazaar Character</h3>
        <img loading="lazy" src="assets/projects/thirdplace/bazaar-character.png" alt="Bazaar Character" class="tp_bazaar_img" />
      </div>

      </div><!-- end tp_first_vp -->

      <!-- Section 3: Street Montages -->
      <div class="tp_montage_section">
        <img loading="lazy" src="assets/projects/thirdplace/montage-combined.png" alt="Street Montages" class="tp_montage_combined_img" id="tp_montage_combined_img" onload="(function(img){var box=document.querySelector('.tp_montage_white_box');if(box)box.style.height=img.offsetHeight+'px';})(this)" />
        <div class="tp_montage_white_box">
          <img loading="lazy" src="assets/projects/thirdplace/dataset.png" alt="Dataset" class="tp_dataset_img" />
        </div>
      </div>

      <!-- Section 4: Site Plan full width -->
      <div class="tp_siteplan_section">
        <img loading="lazy" src="assets/projects/thirdplace/site-plan-a.png" alt="Site Plan" class="tp_siteplan_img" />
      </div>

      <!-- Section 5: Section 2 clipped -->
      <div class="tp_siteplan_section" style="padding-top: 56px; overflow: hidden;">
        <img loading="lazy" src="assets/projects/thirdplace/section-2b.png" alt="Section 2" class="tp_siteplan_img" style="width: calc(67% + 8px);" />
      </div>

      <!-- Section 6: Plan + text + render 4 -->
      <div class="tp_plan_section">
        <img loading="lazy" src="assets/projects/thirdplace/plan.jpg" alt="Plan" class="tp_plan_img" id="tp_plan_img" onload="(function(img){var col=document.querySelector('.tp_plan_right_col');if(col)col.style.height=img.offsetHeight+'px';})(this)" />
        <div class="tp_plan_right_col">
          <div class="tp_plan_desc">
            <p>The project creates open, inviting spaces that act as social extensions - places to gather, pause, or simply pass through. Rather than a building to be entered, it's an urban insert welcoming informal use, dissolving thresholds and encouraging spontaneous interaction.</p>
            <p>Curved, low-rise forms maintain human scale and street intimacy, while open courtyards and flowing axes create fluid and intuitive circulation, offering constant visual engagement. Elements like stepped terraces and double-height volumes enrich the spatial experience, creating opportunities for encounter, observation, and moments of pause.</p>
            <p>Locally sourced materials are used for their thermal comfort, grounding the design within the semi-arid climate and cultural context of Bijapur. The project contemporizes the city's monumental architectural language through a reinterpretation of its mass, rhythm, and spatial generosity. Light and shadow become active design elements, animating surfaces and reinforcing the changing character of the space throughout the day. A sequence of interconnected open and enclosed volumes creates varying degrees of intimacy, allowing the project to accommodate both collective and individual retreat.</p>
          </div>
          <img loading="lazy" src="assets/projects/thirdplace/render-4.png" alt="Render 4" class="tp_plan_stack_img" />
        </div>
      </div>

      <!-- Section 7: Renders + Section 1 + Back in one viewport -->
      <div class="tp_final_viewport">
        <div class="tp_renders_row">
          <img loading="lazy" src="assets/projects/thirdplace/render-2.png" alt="Render 2" class="tp_renders_row_img" style="object-position: left bottom;" />
          <img loading="lazy" src="assets/projects/thirdplace/render-3.png" alt="Render 3" class="tp_renders_row_img" style="object-position: right bottom;" />
        </div>
        <div class="tp_final_section1">
          <img loading="lazy" src="assets/projects/thirdplace/section-1b.png" alt="Section 1" class="tp_final_section1_img" />
        </div>
        <div class="tp_back_row">
          <button class="tp_back_btn pp_back_btn">Back to Gallery</button>
        </div>
      </div>

    </div>
  `
}

