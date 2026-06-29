export function buildCityLivingRoomPortal() {
  return `
    <div class="pp_header">
      <span class="pp_header_title">City's Living Room</span>
      <button class="pp_back_btn">✕ Close</button>
    </div>
    <div class="pp_scroll">

      <!-- Viewport 1: Hero -->
      <section class="clr_hero">
        <div class="clr_left_col">
          <div class="clr_top_block">
            <div class="clr_number">03</div>
            <div class="clr_meta">
              <div class="clr_meta_row">
                <span class="clr_meta_label">Site Location</span>
                <span class="clr_meta_value">Domlur, Bangalore, Karnataka</span>
              </div>
              <div class="clr_meta_row">
                <span class="clr_meta_label">Total Built Up</span>
                <span class="clr_meta_value">6500 sqm</span>
              </div>
            </div>
          </div>
          <div class="clr_desc_bottom">
            The footpath is more than just a path, it's a lived space of interaction, commerce and pause. This project reimagines that energy by shifting focus to the pedestrian's perspective "” an open, inviting, and everyday social ground.
          </div>
        </div>
        <div class="clr_right_col">
          <img loading="lazy" src="assets/projects/citylivingroom/thumbnail.png" alt="City's Living Room" class="clr_hero_img" />
        </div>
      </section>

      <!-- Context text full width -->
      <div class="clr_context_text">
        <p>Conceived as the City's Living Room, the project explores how architecture can foster community through an exploration of movement, light, shadow, compression, and release, the architecture creates a sequence of spaces that reveal themselves gradually, inviting people to linger, gather, and reconnect with the city and one another.</p>
        <p>Emerging from studies of pedestrian movement and socio-spatial behaviour, the project explores architecture as a series of spatial thresholds. The abstract models examine how planes, volumes, and voids can guide movement, frame views, and create moments of intimacy within the public realm.</p>
        <p>Rather than functioning as a singular object, the architecture acts as an extension of the urban fabric"”blurring the boundaries between street, landscape, and built form. Spaces of pause are interwoven with paths of movement, transforming everyday circulation into opportunities for encounter and exchange. Through a careful balance of openness and enclosure, the project creates a human-scaled environment where social life can unfold organically, fostering a sense of belonging within the city.</p>
      </div>

      <!-- Concept images -->
      <div class="clr_concepts_row">
        <img loading="lazy" src="assets/projects/citylivingroom/architectural-concept-1.png" alt="Architectural Concept 1" class="clr_concept_img clr_concept_primary" />
        <img loading="lazy" src="assets/projects/citylivingroom/architectural-concept.png" alt="Architectural Concept" class="clr_concept_img clr_concept_secondary" />
        <img loading="lazy" src="assets/projects/citylivingroom/spain-concept.png" alt="Spain Concept" class="clr_concept_img clr_concept_secondary" style="margin-left: 64px; max-height: calc((100vh - 80px) * 0.92);" />
      </div>

      <!-- Render 1 + site condition -->
      <div class="clr_renders_section">
        <img loading="lazy" src="assets/projects/citylivingroom/render-1.png" alt="Render 1" class="clr_render_main" id="clr_render1" onload="(function(img){var sc=document.querySelector('.clr_site_condition');if(sc)sc.style.height=img.offsetHeight+'px';})(this)" />
        <div class="clr_renders_stack">
          <img loading="lazy" src="assets/projects/citylivingroom/site-condition.png" alt="Site Condition" class="clr_site_condition" />
        </div>
      </div>

      <!-- Text above plan -->
      <div class="clr_context_text">
        <p>Through an interplay of horizontal and vertical planes, the design creates a layered spatial experience defining volumes, guiding movement, and encouraging visual connections across levels. Rather than static enclosures, surfaces shift to reveal, compress, and expand, fostering a fluid sequence of experiences.</p>
        <p>Existing green elements blur the line between inside and outside, softening transitions and turning lower levels into vibrant social living rooms. The stormwater drain, once overlooked, is reimagined as an interactive spine, integrating community spaces along its path and restoring the lost visual and spatial connection with water.</p>
      </div>

      <!-- Plan + text + details -->
      <div class="clr_plan_section">
        <img loading="lazy" src="assets/projects/citylivingroom/plan-2.png" alt="Plan" class="clr_plan_img" onload="(function(img){var r=document.querySelector('.clr_plan_right');if(r)r.style.height=img.offsetHeight+'px';})(this)" />
        <div class="clr_plan_right">
          <div class="clr_plan_text">
            <p>The archive itself is a space of unlearning, located underground due to its need for containment, enabling the super structure to act as an extension of the city. It houses maps, scripts, recordings, and curated displays that invite visitors to question, confront, and reframe accepted narratives acting as a repository of contested memory and forgotten knowledge, challenging dominant perspectives and encouraging new ways of seeing the city, its water systems, its people, and its spaces.</p>
          </div>
          <div class="clr_plan_details">
            <img loading="lazy" src="assets/projects/citylivingroom/detail-1b.jpg" alt="Detail 1" class="clr_plan_detail_img" />
            <img loading="lazy" src="assets/projects/citylivingroom/detail-2b.jpg" alt="Detail 2" class="clr_plan_detail_img" />
          </div>
        </div>
      </div>

      <!-- Render 2 and 3 below plan -->
      <div class="clr_renders_row2">
        <img loading="lazy" src="assets/projects/citylivingroom/render-2.png" alt="Render 2" class="clr_renders_row2_img" />
        <img loading="lazy" src="assets/projects/citylivingroom/render-3.png" alt="Render 3" class="clr_renders_row2_img" />
      </div>

      <!-- Back to gallery -->
      <div class="tp_back_row">
        <button class="tp_back_btn pp_back_btn">Back to Gallery</button>
      </div>

    </div>
  `
}

